import { useForm } from '@inertiajs/react';
import { AlertCircle, Clock } from 'lucide-react';
import { useCallback, useEffect, useRef, useState  } from 'react';
import type {FormEvent} from 'react';
import { Button, ButtonLink, Card, EmptyState, Progress } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import { cn } from '@/lib/utils';
import type { Quiz } from '@/types';

interface SanitizedQuestion {
    id: number;
    question_text: string;
    points: number;
    order: number;
    options: {
        id: number;
        option_text: string;
        order: number;
    }[];
}

interface Props {
    quiz: Quiz;
    questions: SanitizedQuestion[];
    startedAt: string;
}

export default function QuizTake({ quiz, questions, startedAt }: Props) {
    const hasTimeLimit = Boolean(quiz.time_limit_minutes);
    const [secondsLeft, setSecondsLeft] = useState((quiz.time_limit_minutes ?? 15) * 60);

    const { data, setData, post, processing } = useForm<{
        answers: Record<number, number>;
        started_at: string;
    }>({
        answers: {},
        started_at: startedAt,
    });

    // Guards against the expiry effect and a manual submit both firing.
    const submitted = useRef(false);

    const submit = useCallback(() => {
        if (submitted.current) {
            return;
        }

        submitted.current = true;
        post(`/caregiver/quizzes/${quiz.id}/submit`);
    }, [post, quiz.id]);

    useEffect(() => {
        if (!hasTimeLimit) {
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft((previous) => (previous > 0 ? previous - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [hasTimeLimit]);

    // A timer that runs out has to actually do something, so submit what we have.
    useEffect(() => {
        if (hasTimeLimit && secondsLeft === 0) {
            submit();
        }
    }, [hasTimeLimit, secondsLeft, submit]);

    const answeredCount = Object.keys(data.answers).length;
    const isLowOnTime = hasTimeLimit && secondsLeft <= 60;

    const formattedTime = `${Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        submit();
    };

    if (questions.length === 0) {
        return (
            <CaregiverLayout title={quiz.title}>
                <div className="mx-auto max-w-3xl">
                    <EmptyState
                        icon={<AlertCircle className="size-5" />}
                        title="This assessment has no questions yet"
                        description="It is not ready to be taken. Please check back later."
                        action={
                            <ButtonLink href={`/caregiver/quizzes/${quiz.id}`} variant="secondary">
                                Back to assessment
                            </ButtonLink>
                        }
                    />
                </div>
            </CaregiverLayout>
        );
    }

    return (
        <CaregiverLayout title={quiz.title}>
            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
                <div className="sticky top-[68px] z-30 -mx-4 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-accent-ink">
                                Assessment • {quiz.passing_score}% to pass • {questions.length} questions
                            </p>
                            <h1 className="mt-0.5 truncate text-sm font-semibold tracking-tight text-ink sm:text-base">{quiz.title}</h1>
                            <p className="tabular mt-0.5 text-xs text-ink-subtle">
                                {answeredCount} of {questions.length} answered • Unanswered marked incorrect
                            </p>
                        </div>

                        {hasTimeLimit ? (
                            <p
                                aria-live={isLowOnTime ? 'assertive' : 'off'}
                                className={cn(
                                    'tabular inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold',
                                    isLowOnTime
                                        ? 'border-danger-line bg-danger-soft text-danger'
                                        : 'border-line bg-surface-muted text-ink-muted',
                                )}
                            >
                                <Clock className="size-4" />
                                {formattedTime}
                            </p>
                        ) : null}
                    </div>

                    <Progress className="mt-3" value={(answeredCount / questions.length) * 100} />
                </div>

                <ol className="mt-8 space-y-6">
                    {questions.map((question, index) => (
                        <li key={question.id}>
                            <Card as="fieldset" className="p-6">
                                <legend className="sr-only">Question {index + 1}</legend>

                                <p className="tabular text-sm font-medium text-ink-subtle">
                                    Question {index + 1} of {questions.length}
                                </p>
                                <p className="mt-1.5 text-lg font-medium text-ink">{question.question_text}</p>

                                <div className="mt-5 space-y-2.5">
                                    {question.options.map((option) => {
                                        const isSelected = data.answers[question.id] === option.id;

                                        return (
                                            <label
                                                key={option.id}
                                                className={cn(
                                                    'flex cursor-pointer items-start gap-3 rounded-control border p-4 transition',
                                                    isSelected
                                                        ? 'border-accent bg-accent-soft ring-1 ring-accent-line'
                                                        : 'border-line bg-surface hover:border-line-strong hover:bg-surface-muted',
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value={option.id}
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        setData('answers', {
                                                            ...data.answers,
                                                            [question.id]: option.id,
                                                        })
                                                    }
                                                    className="mt-0.5 size-4 shrink-0 border-line-strong text-accent focus:ring-accent"
                                                />
                                                <span className={cn('text-sm leading-relaxed', isSelected ? 'font-medium text-ink' : 'text-ink-muted')}>
                                                    {option.option_text}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </Card>
                        </li>
                    ))}
                </ol>

                {answeredCount < questions.length ? (
                    <p className="mt-6 flex items-start gap-2.5 rounded-card border border-warn-line bg-warn-soft p-4 text-sm text-ink">
                        <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-warn" />
                        {questions.length - answeredCount} question
                        {questions.length - answeredCount === 1 ? '' : 's'} still unanswered. Unanswered questions
                        are marked incorrect.
                    </p>
                ) : null}

                <div className="mt-6">
                    <Button type="submit" size="lg" disabled={processing} className="w-full sm:w-auto">
                        {processing ? 'Submitting...' : 'Submit assessment'}
                    </Button>
                </div>
            </form>
        </CaregiverLayout>
    );
}
