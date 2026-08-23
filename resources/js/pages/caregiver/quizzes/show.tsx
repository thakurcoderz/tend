import { Link } from '@inertiajs/react';
import { Award, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Badge, ButtonLink, Card, PageHeader } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { Quiz, QuizAttempt } from '@/types';

interface Props {
    quiz: Quiz & {
        questions_count: number;
        module?: { id: number; title: string; slug: string } | null;
        course?: { id: number; title: string; slug: string } | null;
    };
    attempts: QuizAttempt[];
    bestAttempt?: QuizAttempt | null;
    hasPassed: boolean;
}

export default function QuizShow({ quiz, attempts, bestAttempt, hasPassed }: Props) {
    return (
        <CaregiverLayout title={quiz.title}>
            <div className="mx-auto max-w-3xl">
                <PageHeader
                    breadcrumb={
                        quiz.course ? (
                            <Link href={`/caregiver/courses/${quiz.course.slug}`} className="hover:text-accent-ink">
                                {quiz.course.title}
                            </Link>
                        ) : undefined
                    }
                    title={quiz.title}
                    description={quiz.description ?? undefined}
                    actions={
                        <ButtonLink href={`/caregiver/quizzes/${quiz.id}/take`}>
                            {attempts.length > 0 ? 'Retake assessment' : 'Start assessment'}
                        </ButtonLink>
                    }
                />

                {hasPassed && bestAttempt ? (
                    <Card className="mb-6 border-ok-line bg-ok-soft p-5">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-5 shrink-0 text-ok" />
                            <p className="font-semibold text-ink">
                                Passed with {bestAttempt.percentage}%
                            </p>
                        </div>
                        <p className="mt-1.5 text-sm text-ink-muted">
                            Your best score is on record. You may retake this assessment to improve it.
                        </p>
                    </Card>
                ) : null}

                <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
                    <div className="bg-surface p-5">
                        <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                            <FileText className="size-4" />
                            Questions
                        </dt>
                        <dd className="tabular mt-1 text-2xl font-semibold text-ink">{quiz.questions_count}</dd>
                    </div>
                    <div className="bg-surface p-5">
                        <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                            <Award className="size-4" />
                            Pass mark
                        </dt>
                        <dd className="tabular mt-1 text-2xl font-semibold text-ink">{quiz.passing_score}%</dd>
                    </div>
                    <div className="bg-surface p-5">
                        <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                            <Clock className="size-4" />
                            Time limit
                        </dt>
                        <dd className="tabular mt-1 text-2xl font-semibold text-ink">
                            {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'None'}
                        </dd>
                    </div>
                </dl>

                <section aria-labelledby="attempts-heading" className="mt-8">
                    <h2 id="attempts-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                        Your attempts
                    </h2>

                    {attempts.length > 0 ? (
                        <div className="table-wrap">
                            <table className="tbl">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Score</th>
                                        <th scope="col">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempts.map((attempt) => (
                                        <tr key={attempt.id}>
                                            <td className="whitespace-nowrap text-ink-muted">
                                                {new Date(attempt.completed_at).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="tabular">
                                                {attempt.percentage}%
                                                <span className="ml-1.5 text-ink-subtle">
                                                    ({attempt.score}/{attempt.max_score})
                                                </span>
                                            </td>
                                            <td>
                                                <Badge tone={attempt.passed ? 'ok' : 'danger'}>
                                                    {attempt.passed ? 'Passed' : 'Not passed'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <Card className="p-6">
                            <p className="text-ink-muted">
                                You have not attempted this assessment yet. You can retake it as many times as you
                                need.
                            </p>
                        </Card>
                    )}
                </section>
            </div>
        </CaregiverLayout>
    );
}
