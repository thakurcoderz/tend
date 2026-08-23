<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $category = $request->query('category');
        $query = Course::query()
            ->where('is_published', true)
            ->withCount(['modules', 'lessons'])
            ->orderBy('order');

        if ($category && $category !== 'All') {
            $query->where('category', $category);
        }

        $courses = $query->get();

        $enrollments = Enrollment::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('course_id');

        $categories = Course::query()
            ->where('is_published', true)
            ->distinct()
            ->pluck('category')
            ->toArray();

        return Inertia::render('caregiver/courses/index', [
            'courses' => $courses->map(function ($course) use ($enrollments) {
                $enrollment = $enrollments->get($course->id);

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'badge_title' => $course->badge_title,
                    'category' => $course->category,
                    'level' => $course->level,
                    'summary' => $course->summary,
                    'estimated_hours' => $course->estimated_hours,
                    'thumbnail' => $course->thumbnail,
                    'modules_count' => $course->modules_count,
                    'lessons_count' => $course->lessons_count,
                    'is_enrolled' => $enrollment !== null,
                    'enrollment_status' => $enrollment ? $enrollment->status : null,
                    'progress_percentage' => $enrollment ? $enrollment->progress_percentage : 0,
                ];
            }),
            'categories' => array_values(array_unique(array_merge(['All'], $categories))),
            'selectedCategory' => $category ?? 'All',
        ]);
    }

    public function show(string $slug): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $course = Course::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->with(['modules' => function ($query) {
                $query->where('is_published', true)
                    ->orderBy('order')
                    ->with(['lessons' => function ($q) {
                        $q->where('is_published', true)->orderBy('order');
                    }, 'quiz' => function ($q) {
                        $q->where('is_published', true)->withCount('questions');
                    }]);
            }])
            ->firstOrFail();

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        // Get completed lessons for this user
        $completedLessonIds = LessonProgress::query()
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->pluck('lesson_id')
            ->toArray();

        // Get quiz attempts for quizzes in this course
        $quizIds = $course->modules->pluck('quiz.id')->filter()->toArray();
        $quizAttempts = QuizAttempt::query()
            ->where('user_id', $user->id)
            ->whereIn('quiz_id', $quizIds)
            ->get()
            ->groupBy('quiz_id');

        $certificate = $user->certificates()
            ->where('course_id', $course->id)
            ->first();

        return Inertia::render('caregiver/courses/show', [
            'course' => $course,
            'isEnrolled' => $enrollment !== null,
            'enrollment' => $enrollment,
            'completedLessonIds' => $completedLessonIds,
            'quizAttempts' => $quizAttempts,
            'certificate' => $certificate,
        ]);
    }

    public function enroll(Course $course): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $enrollment = Enrollment::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'status' => 'in_progress',
                'progress_percentage' => 0,
                'enrolled_at' => Carbon::now(),
            ]
        );

        ActivityLogger::log(
            'course.enrolled',
            "Caregiver {$user->name} enrolled in {$course->title}.",
            ['course_id' => $course->id, 'category' => $course->category],
            $user
        );

        return redirect()->route('caregiver.courses.show', $course->slug)
            ->with('success', "You have enrolled in {$course->title}! You can now begin your first lesson.");
    }
}
