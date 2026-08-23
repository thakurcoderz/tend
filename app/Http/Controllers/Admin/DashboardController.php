<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $caregiversCount = User::where('role', 'caregiver')->count();
        $coursesCount = Course::count();
        $modulesCount = Module::count();
        $lessonsCount = Lesson::count();
        $quizzesCount = Quiz::count();
        $certificatesIssued = Certificate::count();
        $totalEnrollments = Enrollment::count();
        $completedEnrollments = Enrollment::where('status', 'completed')->count();

        $quizAttempts = QuizAttempt::all();
        $totalAttempts = $quizAttempts->count();
        $passedAttempts = $quizAttempts->where('passed', true)->count();
        $avgScore = $totalAttempts > 0 ? round($quizAttempts->avg('percentage'), 1) : 0;
        $passRate = $totalAttempts > 0 ? round(($passedAttempts / $totalAttempts) * 100, 1) : 0;

        $recentActivities = ActivityLog::query()
            ->with('user')
            ->latest('created_at')
            ->take(12)
            ->get();

        $recentCertificates = Certificate::query()
            ->with(['user', 'course'])
            ->latest('issued_at')
            ->take(5)
            ->get();

        $coursesSummary = Course::query()
            ->withCount(['modules', 'lessons', 'enrollments'])
            ->orderBy('order')
            ->get();

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'caregiversCount' => $caregiversCount,
                'coursesCount' => $coursesCount,
                'modulesCount' => $modulesCount,
                'lessonsCount' => $lessonsCount,
                'quizzesCount' => $quizzesCount,
                'certificatesIssued' => $certificatesIssued,
                'totalEnrollments' => $totalEnrollments,
                'completedEnrollments' => $completedEnrollments,
                'avgScore' => $avgScore,
                'passRate' => $passRate,
            ],
            'recentActivities' => $recentActivities,
            'recentCertificates' => $recentCertificates,
            'coursesSummary' => $coursesSummary,
        ]);
    }
}
