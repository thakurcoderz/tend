import confetti from 'canvas-confetti';
import { Award, Check, RotateCcw, X } from 'lucide-react';
import { useEffect } from 'react';
import { Badge, ButtonLink, Card } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import { cn } from '@/lib/utils';
import type { Certificate, Course, Quiz, QuizAttempt } from '@/types';

interface QuestionFeedback {
    question_id: number;
    question_text: string;
    explanation?: string | null;
    points: number;
    selected_option_id: number | null;
    selected_option_text: string;
    correct_option_id: number;
    correct_option_text: string;
    is_correct: boolean;
}

interface Props {
    quiz: Quiz;
    attempt: QuizAttempt;
    percentage: number;
    passed: boolean;
    earnedPoints: number;
    totalPoints: number;
    feedback: QuestionFeedback[];
    certificate?: Certificate | null;
    course?: Course | null;
}

export default function QuizResult({
    quiz,
    percentage,
    passed,
    earnedPoints,
    totalPoints,
    feedback,
    certificate,
    course,
}: Props) {
    useEffect(() => {
        if (!passed) {
            return;
        }

        // Celebration is decorative, so skip it when the viewer asked for less motion.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        confetti({ particleCount: 120, spread: 70, origin: { y: 0.35 } });
    }, [passed]);

    return (
        <CaregiverLayout title="Assessment result">
            <div className="mx-auto max-w-3xl">
                <Card
                    className={cn('p-8 text-center', passed ? 'border-ok-line bg-ok-soft' : 'border-line')}
                >
                    <p className="text-sm font-medium text-ink-muted">{quiz.title}</p>
                    <p className={cn('tabular mt-3 text-6xl font-semibold tracking-tight', passed ? 'text-ok' : 'text-ink')}>
                        {percentage}%
                    </p>
                    <p className="tabular mt-2 text-ink-muted">
                        {earnedPoints} of {totalPoints} points · pass mark {quiz.passing_score}%
                    </p>

                    <div className="mt-5">
                        <Badge tone={passed ? 'ok' : 'danger'}>
                            {passed ? 'Passed' : 'Not passed'}
                        </Badge>
                    </div>

                    <p className="mx-auto mt-4 max-w-[52ch] text-ink-muted">
                        {passed
                            ? 'You have demonstrated competency in this module.'
                            : 'Review the explanations below and retake the assessment when you are ready.'}
                    </p>
                </Card>

                {passed && certificate ? (
                    <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent-ink">
                                <Award className="size-5" />
                            </span>
                            <div>
                                <p className="font-semibold text-ink">Certificate issued</p>
                                <p className="font-mono text-sm text-ink-muted">
                                    {certificate.certificate_number}
                                </p>
                            </div>
                        </div>
                        <ButtonLink href={`/caregiver/certificates/${certificate.certificate_number}`}>
                            View certificate
                        </ButtonLink>
                    </Card>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href={`/caregiver/quizzes/${quiz.id}`} variant={passed ? 'secondary' : 'primary'}>
                        <RotateCcw className="size-4" />
                        Retake assessment
                    </ButtonLink>
                    {course ? (
                        <ButtonLink href={`/caregiver/courses/${course.slug}`} variant="secondary">
                            Back to course
                        </ButtonLink>
                    ) : null}
                </div>

                <section aria-labelledby="review-heading" className="mt-10">
                    <h2 id="review-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                        Review your answers
                    </h2>

                    <ol className="space-y-4">
                        {feedback.map((item, index) => (
                            <li key={item.question_id}>
                                <Card className="p-6">
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={cn(
                                                'flex size-6 shrink-0 items-center justify-center rounded-full',
                                                item.is_correct ? 'bg-ok-soft text-ok' : 'bg-danger-soft text-danger',
                                            )}
                                        >
                                            {item.is_correct ? (
                                                <Check className="size-4" />
                                            ) : (
                                                <X className="size-4" />
                                            )}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="tabular text-sm text-ink-subtle">Question {index + 1}</p>
                                            <p className="mt-0.5 font-medium text-ink">{item.question_text}</p>

                                            <dl className="mt-4 space-y-2 text-sm">
                                                <div className="flex flex-wrap gap-x-2">
                                                    <dt className="text-ink-muted">Your answer:</dt>
                                                    <dd
                                                        className={
                                                            item.is_correct ? 'font-medium text-ok' : 'font-medium text-danger'
                                                        }
                                                    >
                                                        {item.selected_option_text || 'Not answered'}
                                                    </dd>
                                                </div>

                                                {!item.is_correct ? (
                                                    <div className="flex flex-wrap gap-x-2">
                                                        <dt className="text-ink-muted">Correct answer:</dt>
                                                        <dd className="font-medium text-ok">
                                                            {item.correct_option_text}
                                                        </dd>
                                                    </div>
                                                ) : null}
                                            </dl>

                                            {item.explanation ? (
                                                <p className="mt-4 rounded-control bg-surface-muted p-3.5 text-sm text-ink-muted">
                                                    {item.explanation}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </Card>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </CaregiverLayout>
    );
}
