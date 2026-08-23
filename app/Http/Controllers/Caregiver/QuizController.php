<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function show(Quiz $quiz): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $quiz->load(['module.course', 'course', 'questions']);

        $attempts = QuizAttempt::query()
            ->where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->latest('completed_at')
            ->get();

        $bestAttempt = $attempts->sortByDesc('percentage')->first();
        $hasPassed = $attempts->contains('passed', true);

        return Inertia::render('caregiver/quizzes/show', [
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description,
                'passing_score' => $quiz->passing_score,
                'time_limit_minutes' => $quiz->time_limit_minutes,
                'questions_count' => $quiz->questions->count(),
                'module' => $quiz->module ? [
                    'id' => $quiz->module->id,
                    'title' => $quiz->module->title,
                    'slug' => $quiz->module->slug,
                ] : null,
                'course' => $quiz->course ?? $quiz->module?->course,
            ],
            'attempts' => $attempts,
            'bestAttempt' => $bestAttempt,
            'hasPassed' => $hasPassed,
        ]);
    }

    public function take(Quiz $quiz): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $quiz->load(['module.course', 'course', 'questions.options']);

        ActivityLogger::log(
            'quiz.started',
            "Caregiver {$user->name} began quiz attempt for '{$quiz->title}'.",
            ['quiz_id' => $quiz->id, 'quiz_title' => $quiz->title],
            $user
        );

        // Sanitize options so is_correct is hidden during the exam!
        $sanitizedQuestions = $quiz->questions->map(function ($q) {
            return [
                'id' => $q->id,
                'question_text' => $q->question_text,
                'points' => $q->points,
                'order' => $q->order,
                'options' => $q->options->map(function ($opt) {
                    return [
                        'id' => $opt->id,
                        'option_text' => $opt->option_text,
                        'order' => $opt->order,
                    ];
                }),
            ];
        });

        return Inertia::render('caregiver/quizzes/take', [
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description,
                'passing_score' => $quiz->passing_score,
                'time_limit_minutes' => $quiz->time_limit_minutes,
                'module' => $quiz->module,
                'course' => $quiz->course ?? $quiz->module?->course,
            ],
            'questions' => $sanitizedQuestions,
            'startedAt' => Carbon::now()->toIso8601String(),
        ]);
    }

    public function submit(Request $request, Quiz $quiz): Response|RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'started_at' => ['nullable', 'date'],
        ]);

        $userAnswers = $validated['answers']; // map of [question_id => selected_option_id]
        $quiz->load(['questions.options', 'module.course', 'course']);

        $totalPoints = 0;
        $earnedPoints = 0;
        $questionFeedback = [];

        foreach ($quiz->questions as $question) {
            $totalPoints += $question->points;
            $selectedOptionId = $userAnswers[$question->id] ?? null;

            $correctOption = $question->options->firstWhere('is_correct', true);
            $selectedOption = $question->options->firstWhere('id', $selectedOptionId);

            $isCorrect = $selectedOption && $selectedOption->is_correct;
            if ($isCorrect) {
                $earnedPoints += $question->points;
            }

            $questionFeedback[] = [
                'question_id' => $question->id,
                'question_text' => $question->question_text,
                'explanation' => $question->explanation,
                'points' => $question->points,
                'selected_option_id' => $selectedOptionId,
                'selected_option_text' => $selectedOption ? $selectedOption->option_text : 'Not answered',
                'correct_option_id' => $correctOption ? $correctOption->id : null,
                'correct_option_text' => $correctOption ? $correctOption->option_text : '',
                'is_correct' => $isCorrect,
            ];
        }

        $percentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0;
        $passed = $percentage >= $quiz->passing_score;

        $startedAt = ! empty($validated['started_at']) ? Carbon::parse($validated['started_at']) : Carbon::now()->subMinutes(10);
        $completedAt = Carbon::now();

        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'score' => $earnedPoints,
            'max_score' => $totalPoints,
            'percentage' => $percentage,
            'passed' => $passed,
            'user_answers' => $userAnswers,
            'started_at' => $startedAt,
            'completed_at' => $completedAt,
        ]);

        ActivityLogger::log(
            $passed ? 'quiz.passed' : 'quiz.failed',
            "Caregiver {$user->name} ".($passed ? 'passed' : 'did not pass')." '{$quiz->title}' with score {$percentage}%.",
            [
                'quiz_id' => $quiz->id,
                'score' => $earnedPoints,
                'max_score' => $totalPoints,
                'percentage' => $percentage,
                'passed' => $passed,
            ],
            $user
        );

        $course = $quiz->course ?? $quiz->module?->course;
        $certificate = null;

        // If passed and associated with a course, generate official Certificate!
        if ($passed && $course) {
            $certNumber = 'CERT-'.strtoupper(Str::slug($course->badge_title ?: 'CG', '')).'-'.date('Y').'-'.rand(1000, 9999);
            $certHash = Str::uuid()->toString();

            $certificate = Certificate::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                ],
                [
                    'module_id' => $quiz->module_id,
                    'certificate_number' => $certNumber,
                    'title' => $course->title,
                    'recipient_name' => $user->name,
                    'grade_percentage' => $percentage,
                    'verification_hash' => $certHash,
                    'issued_at' => Carbon::now(),
                    'expires_at' => Carbon::now()->addYears(2),
                ]
            );

            ActivityLogger::log(
                'certificate.issued',
                "Certificate {$certificate->certificate_number} issued to {$user->name} for {$course->title}.",
                [
                    'certificate_number' => $certificate->certificate_number,
                    'course_title' => $course->title,
                    'grade' => $percentage,
                ],
                $user
            );
        }

        return Inertia::render('caregiver/quizzes/result', [
            'quiz' => $quiz,
            'attempt' => $attempt,
            'percentage' => $percentage,
            'passed' => $passed,
            'earnedPoints' => $earnedPoints,
            'totalPoints' => $totalPoints,
            'feedback' => $questionFeedback,
            'certificate' => $certificate,
            'course' => $course,
        ]);
    }
}
