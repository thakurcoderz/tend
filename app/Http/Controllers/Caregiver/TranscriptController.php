<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TranscriptController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $enrollments = Enrollment::query()
            ->where('user_id', $user->id)
            ->with(['course.modules.lessons'])
            ->latest('enrolled_at')
            ->get();

        $lessonProgress = LessonProgress::query()
            ->where('user_id', $user->id)
            ->with('lesson.module.course')
            ->latest('completed_at')
            ->get();

        $quizAttempts = QuizAttempt::query()
            ->where('user_id', $user->id)
            ->with(['quiz.module.course', 'quiz.course'])
            ->latest('completed_at')
            ->get();

        $certificates = $user->certificates()
            ->with('course')
            ->latest('issued_at')
            ->get();

        return Inertia::render('caregiver/transcript/index', [
            'user' => $user,
            'enrollments' => $enrollments,
            'lessonProgress' => $lessonProgress,
            'quizAttempts' => $quizAttempts,
            'certificates' => $certificates,
        ]);
    }
}
