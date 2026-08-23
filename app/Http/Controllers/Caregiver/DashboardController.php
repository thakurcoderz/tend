<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $enrollments = Enrollment::query()
            ->where('user_id', $user->id)
            ->with(['course' => function ($query) {
                $query->withCount(['modules', 'lessons']);
            }])
            ->get();

        $completedCoursesCount = $enrollments->where('status', 'completed')->count();
        $inProgressCoursesCount = $enrollments->where('status', 'in_progress')->count();
        $completedLessonsCount = LessonProgress::query()
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $certificatesCount = Certificate::query()
            ->where('user_id', $user->id)
            ->count();

        $passedQuizzesCount = QuizAttempt::query()
            ->where('user_id', $user->id)
            ->where('passed', true)
            ->distinct('quiz_id')
            ->count('quiz_id');

        $activeEnrollments = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->with(['course.modules.lessons'])
            ->latest('updated_at')
            ->take(3)
            ->get();

        $recentCertificates = Certificate::query()
            ->where('user_id', $user->id)
            ->with('course')
            ->latest('issued_at')
            ->take(3)
            ->get();

        $recentActivities = $user->activityLogs()
            ->latest('created_at')
            ->take(8)
            ->get();

        $recommendedCourses = Course::query()
            ->where('is_published', true)
            ->whereNotIn('id', $enrollments->pluck('course_id'))
            ->withCount(['modules', 'lessons'])
            ->take(2)
            ->get();

        return Inertia::render('caregiver/dashboard', [
            'stats' => [
                'enrolledCount' => $enrollments->count(),
                'inProgressCount' => $inProgressCoursesCount,
                'completedCount' => $completedCoursesCount,
                'lessonsCompleted' => $completedLessonsCount,
                'certificatesCount' => $certificatesCount,
                'passedQuizzes' => $passedQuizzesCount,
            ],
            'activeEnrollments' => $activeEnrollments,
            'recentCertificates' => $recentCertificates,
            'recentActivities' => $recentActivities,
            'recommendedCourses' => $recommendedCourses,
        ]);
    }
}
