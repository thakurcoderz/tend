<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LearningController extends Controller
{
    public function lesson(string $courseSlug, string $moduleSlug, string $lessonSlug): Response|RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $course = Course::query()
            ->where('slug', $courseSlug)
            ->where('is_published', true)
            ->with(['modules' => function ($query) {
                $query->where('is_published', true)
                    ->orderBy('order')
                    ->with(['lessons' => function ($q) {
                        $q->where('is_published', true)->orderBy('order');
                    }, 'quiz']);
            }])
            ->firstOrFail();

        $module = $course->modules->firstWhere('slug', $moduleSlug);
        if (! $module) {
            abort(404, 'Module not found.');
        }

        $lesson = $module->lessons->firstWhere('slug', $lessonSlug);
        if (! $lesson) {
            abort(404, 'Lesson not found.');
        }

        // Auto-enroll if not already enrolled
        Enrollment::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['status' => 'in_progress', 'progress_percentage' => 0, 'enrolled_at' => Carbon::now()]
        );

        $isCompleted = LessonProgress::query()
            ->where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->where('status', 'completed')
            ->exists();

        // Completed lesson IDs in this course
        $allLessonIds = $course->modules->flatMap->lessons->pluck('id');
        $completedLessonIds = LessonProgress::query()
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $allLessonIds)
            ->where('status', 'completed')
            ->pluck('lesson_id')
            ->toArray();

        // Find previous and next lessons across modules
        $allLessonsList = [];
        foreach ($course->modules as $mod) {
            foreach ($mod->lessons as $les) {
                $allLessonsList[] = [
                    'id' => $les->id,
                    'title' => $les->title,
                    'slug' => $les->slug,
                    'module_slug' => $mod->slug,
                    'module_title' => $mod->title,
                ];
            }
        }

        $currentIndex = -1;
        foreach ($allLessonsList as $idx => $item) {
            if ($item['id'] === $lesson->id) {
                $currentIndex = $idx;
                break;
            }
        }

        $prevLesson = $currentIndex > 0 ? $allLessonsList[$currentIndex - 1] : null;
        $nextLesson = $currentIndex < count($allLessonsList) - 1 ? $allLessonsList[$currentIndex + 1] : null;

        return Inertia::render('caregiver/learning/lesson', [
            'course' => $course,
            'module' => $module,
            'lesson' => $lesson,
            'isCompleted' => $isCompleted,
            'completedLessonIds' => $completedLessonIds,
            'prevLesson' => $prevLesson,
            'nextLesson' => $nextLesson,
        ]);
    }

    public function complete(Request $request, Lesson $lesson): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $progress = LessonProgress::firstOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'status' => 'completed',
                'completed_at' => Carbon::now(),
            ]
        );

        if ($progress->wasRecentlyCreated || $progress->status !== 'completed') {
            $progress->update([
                'status' => 'completed',
                'completed_at' => Carbon::now(),
            ]);

            ActivityLogger::log(
                'lesson.completed',
                "Caregiver {$user->name} completed lesson '{$lesson->title}'.",
                [
                    'lesson_id' => $lesson->id,
                    'lesson_title' => $lesson->title,
                    'module_id' => $lesson->module_id,
                ],
                $user
            );
        }

        // Recalculate Course progress percentage
        $module = $lesson->module;
        $course = $module->course;

        if ($course) {
            $totalCourseLessons = $course->lessons()->count();
            $completedLessonsCount = LessonProgress::query()
                ->where('user_id', $user->id)
                ->whereIn('lesson_id', $course->lessons()->pluck('lessons.id'))
                ->where('status', 'completed')
                ->count();

            $percentage = $totalCourseLessons > 0
                ? (int) round(($completedLessonsCount / $totalCourseLessons) * 100)
                : 100;

            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();

            if ($enrollment) {
                $enrollment->update([
                    'progress_percentage' => $percentage,
                    'status' => $percentage >= 100 ? 'completed' : 'in_progress',
                    'completed_at' => $percentage >= 100 ? Carbon::now() : null,
                ]);

                if ($percentage >= 100 && $enrollment->wasChanged('status')) {
                    ActivityLogger::log(
                        'course.completed',
                        "Caregiver {$user->name} completed all lessons in {$course->title}!",
                        ['course_id' => $course->id],
                        $user
                    );
                }
            }
        }

        // Redirect to next lesson or quiz if available
        $nextLessonSlug = $request->input('next_lesson_slug');
        $nextModuleSlug = $request->input('next_module_slug');

        if ($nextLessonSlug && $nextModuleSlug) {
            return redirect()->route('caregiver.learning.lesson', [
                'courseSlug' => $course->slug,
                'moduleSlug' => $nextModuleSlug,
                'lessonSlug' => $nextLessonSlug,
            ])->with('success', 'Lesson marked complete! Continuing to next lesson.');
        }

        // If module has a quiz, suggest quiz
        if ($module->quiz) {
            return redirect()->route('caregiver.quizzes.show', $module->quiz->id)
                ->with('success', 'Great work! You finished the module lessons. Ready to take the knowledge quiz?');
        }

        return back()->with('success', 'Lesson completed successfully!');
    }
}
