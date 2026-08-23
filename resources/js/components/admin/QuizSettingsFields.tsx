import { Field, Input, Textarea } from '@/components/ui';

export interface QuizFormData {
    title: string;
    description: string;
    passing_score: number;
    time_limit_minutes: number;
    is_published: boolean;
}

interface Props {
    data: QuizFormData;
    errors: Partial<Record<keyof QuizFormData, string>>;
    setData: <K extends keyof QuizFormData>(key: K, value: QuizFormData[K]) => void;
}

/** Shared by the assessment create and edit screens. */
export default function QuizSettingsFields({ data, errors, setData }: Props) {
    return (
        <div className="space-y-5">
            <Field label="Assessment title" htmlFor="title" error={errors.title} required>
                <Input
                    id="title"
                    required
                    aria-invalid={Boolean(errors.title)}
                    value={data.title}
                    onChange={(event) => setData('title', event.target.value)}
                />
            </Field>

            <Field
                label="Description"
                htmlFor="description"
                error={errors.description}
                hint="Shown to caregivers before they start."
            >
                <Textarea
                    id="description"
                    rows={3}
                    aria-invalid={Boolean(errors.description)}
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field
                    label="Pass mark (%)"
                    htmlFor="passing_score"
                    error={errors.passing_score}
                    required
                >
                    <Input
                        id="passing_score"
                        type="number"
                        min={1}
                        max={100}
                        required
                        aria-invalid={Boolean(errors.passing_score)}
                        value={data.passing_score}
                        onChange={(event) => setData('passing_score', Number(event.target.value))}
                    />
                </Field>

                <Field
                    label="Time limit (minutes)"
                    htmlFor="time_limit_minutes"
                    error={errors.time_limit_minutes}
                    hint="The assessment submits automatically when time runs out."
                >
                    <Input
                        id="time_limit_minutes"
                        type="number"
                        min={1}
                        aria-invalid={Boolean(errors.time_limit_minutes)}
                        value={data.time_limit_minutes}
                        onChange={(event) => setData('time_limit_minutes', Number(event.target.value))}
                    />
                </Field>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                    type="checkbox"
                    checked={data.is_published}
                    onChange={(event) => setData('is_published', event.target.checked)}
                    className="size-4 rounded border-line-strong text-accent focus:ring-accent"
                />
                Publish this assessment
            </label>
        </div>
    );
}
