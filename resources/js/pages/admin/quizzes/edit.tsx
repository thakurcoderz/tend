import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { useState  } from 'react';
import type {FormEvent} from 'react';
import QuizSettingsFields from '@/components/admin/QuizSettingsFields';
import { Badge, Button, Card, Field, Input, PageHeader, Textarea } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { Course, Module, Question, Quiz } from '@/types';

interface Props {
    quiz: Quiz & {
        questions: (Question & {
            options: {
                id: number;
                option_text: string;
                is_correct: boolean;
                order: number;
            }[];
        })[];
    };
    module?: Module | null;
    course?: Course | null;
}

const BLANK_OPTIONS = [
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
];

export default function QuizEdit({ quiz, module, course }: Props) {
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [questionText, setQuestionText] = useState('');
    const [explanation, setExplanation] = useState('');
    const [points, setPoints] = useState(1);
    const [options, setOptions] = useState(BLANK_OPTIONS);

    const { data, setData, put, processing, errors } = useForm({
        title: quiz.title,
        description: quiz.description || '',
        passing_score: quiz.passing_score,
        time_limit_minutes: quiz.time_limit_minutes || 15,
        is_published: quiz.is_published,
    });

    const resetQuestionForm = () => {
        setShowQuestionForm(false);
        setQuestionText('');
        setExplanation('');
        setPoints(1);
        setOptions(BLANK_OPTIONS);
    };

    const handleCreateQuestion = (event: FormEvent) => {
        event.preventDefault();
        router.post(
            `/admin/quizzes/${quiz.id}/questions`,
            {
                question_text: questionText,
                explanation,
                points,
                options: options.filter((option) => option.option_text.trim() !== ''),
            },
            { onSuccess: resetQuestionForm },
        );
    };

    const filledOptions = options.filter((option) => option.option_text.trim() !== '').length;

    return (
        <AdminLayout title={quiz.title}>
            <PageHeader
                breadcrumb={
                    course ? (
                        <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="inline-flex items-center gap-1.5 hover:text-accent-ink"
                        >
                            <ArrowLeft className="size-4" />
                            {course.title}
                        </Link>
                    ) : undefined
                }
                title="Edit assessment"
                description={module ? `For module: ${module.title}` : undefined}
                actions={
                    <Badge tone={quiz.is_published ? 'ok' : 'neutral'}>
                        {quiz.is_published ? 'Published' : 'Draft'}
                    </Badge>
                }
            />

            <div className="grid gap-8 lg:grid-cols-5">
                <form onSubmit={(event) => {
 event.preventDefault(); put(`/admin/quizzes/${quiz.id}`); 
}} className="lg:col-span-2" noValidate>
                    <Card as="section" aria-labelledby="settings-heading" className="p-6">
                        <h2 id="settings-heading" className="mb-5 font-semibold text-ink">
                            Settings
                        </h2>
                        <QuizSettingsFields data={data} errors={errors} setData={setData} />
                    </Card>

                    <div className="mt-6">
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? 'Saving...' : 'Save settings'}
                        </Button>
                    </div>
                </form>

                <section aria-labelledby="questions-heading" className="lg:col-span-3">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 id="questions-heading" className="font-semibold text-ink">
                            Questions ({quiz.questions?.length ?? 0})
                        </h2>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowQuestionForm((open) => !open)}
                            aria-expanded={showQuestionForm}
                        >
                            <Plus className="size-4" />
                            Add question
                        </Button>
                    </div>

                    {showQuestionForm ? (
                        <Card className="mb-4 p-6">
                            <form onSubmit={handleCreateQuestion} className="space-y-5">
                                <Field label="Question" htmlFor="question_text" required>
                                    <Textarea
                                        id="question_text"
                                        rows={3}
                                        required
                                        value={questionText}
                                        onChange={(event) => setQuestionText(event.target.value)}
                                    />
                                </Field>

                                <fieldset>
                                    <legend className="label">Answer options</legend>
                                    <p className="mb-3 text-sm text-ink-muted">
                                        Select the radio button next to the correct answer.
                                    </p>

                                    <div className="space-y-2">
                                        {options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="correct_option"
                                                    checked={option.is_correct}
                                                    onChange={() =>
                                                        setOptions(
                                                            options.map((current, i) => ({
                                                                ...current,
                                                                is_correct: i === index,
                                                            })),
                                                        )
                                                    }
                                                    aria-label={`Mark option ${index + 1} as correct`}
                                                    className="size-4 shrink-0 border-line-strong text-accent focus:ring-accent"
                                                />
                                                <Input
                                                    aria-label={`Option ${index + 1} text`}
                                                    value={option.option_text}
                                                    onChange={(event) => {
                                                        const next = [...options];
                                                        next[index] = {
                                                            ...next[index],
                                                            option_text: event.target.value,
                                                        };
                                                        setOptions(next);
                                                    }}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    className="shrink-0 text-danger"
                                                    disabled={options.length <= 2}
                                                    onClick={() =>
                                                        setOptions(options.filter((_, i) => i !== index))
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="sr-only">Remove option {index + 1}</span>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() =>
                                            setOptions([...options, { option_text: '', is_correct: false }])
                                        }
                                    >
                                        <Plus className="size-4" />
                                        Add option
                                    </Button>
                                </fieldset>

                                <Field
                                    label="Explanation"
                                    htmlFor="explanation"
                                    hint="Shown after submission to explain the correct answer."
                                >
                                    <Textarea
                                        id="explanation"
                                        rows={2}
                                        value={explanation}
                                        onChange={(event) => setExplanation(event.target.value)}
                                    />
                                </Field>

                                <Field label="Points" htmlFor="points">
                                    <Input
                                        id="points"
                                        type="number"
                                        min={1}
                                        value={points}
                                        onChange={(event) => setPoints(Number(event.target.value))}
                                        className="max-w-32"
                                    />
                                </Field>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="submit"
                                        disabled={!questionText.trim() || filledOptions < 2}
                                    >
                                        Add question
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={resetQuestionForm}>
                                        Cancel
                                    </Button>
                                </div>

                                {filledOptions < 2 ? (
                                    <p className="help">Fill in at least two answer options.</p>
                                ) : null}
                            </form>
                        </Card>
                    ) : null}

                    {!quiz.questions || quiz.questions.length === 0 ? (
                        <Card className="p-6">
                            <p className="text-ink-muted">
                                No questions yet. Add at least one before publishing this assessment.
                            </p>
                        </Card>
                    ) : (
                        <ol className="space-y-3">
                            {quiz.questions.map((question, index) => (
                                <li key={question.id}>
                                    <Card className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="tabular text-sm text-ink-subtle">
                                                    Question {index + 1} · {question.points} point
                                                    {question.points === 1 ? '' : 's'}
                                                </p>
                                                <p className="mt-1 font-medium text-ink">
                                                    {question.question_text}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm('Delete this question?')) {
                                                        router.delete(`/admin/questions/${question.id}`);
                                                    }
                                                }}
                                                className="btn btn-ghost btn-sm shrink-0 text-danger"
                                            >
                                                <Trash2 className="size-4" />
                                                <span className="sr-only">Delete question {index + 1}</span>
                                            </button>
                                        </div>

                                        <ul className="mt-4 space-y-1.5">
                                            {(question.options ?? []).map((option) => (
                                                <li
                                                    key={option.id}
                                                    className={`flex items-start gap-2 rounded-control px-3 py-2 text-sm ${
                                                        option.is_correct
                                                            ? 'bg-ok-soft text-ink'
                                                            : 'bg-surface-muted text-ink-muted'
                                                    }`}
                                                >
                                                    {option.is_correct ? (
                                                        <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                                                    ) : (
                                                        <span className="mt-0.5 size-4 shrink-0" />
                                                    )}
                                                    {option.option_text}
                                                </li>
                                            ))}
                                        </ul>

                                        {question.explanation ? (
                                            <p className="mt-3 text-sm text-ink-muted">{question.explanation}</p>
                                        ) : null}
                                    </Card>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}
