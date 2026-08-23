import { Plus, Trash2 } from 'lucide-react';
import { Button, Field, Input, Select, Textarea } from '@/components/ui';

export const CONTENT_TYPES = [
    { value: 'text_guide', label: 'Clinical text guide' },
    { value: 'protocol', label: 'Safety protocol' },
    { value: 'checklist', label: 'Procedure checklist' },
    { value: 'video', label: 'Video lesson' },
];

export interface LessonFormData {
    title: string;
    content_type: string;
    duration_minutes: number;
    summary: string;
    body: string;
    video_url: string;
    audio_url: string;
    key_takeaways: string[];
    clinical_checklist: string[];
    is_published: boolean;
    order: number;
}

interface ListFieldProps {
    legend: string;
    hint: string;
    name: string;
    items: string[];
    onChange: (items: string[]) => void;
}

/**
 * Repeatable text rows. The list lives only in form state, so adding a row and
 * submitting immediately sends that row rather than a stale copy.
 */
function StringListField({ legend, hint, name, items, onChange }: ListFieldProps) {
    const rows = items.length > 0 ? items : [''];

    return (
        <fieldset>
            <legend className="label">{legend}</legend>
            <p className="mb-3 text-sm text-ink-muted">{hint}</p>

            <div className="space-y-2">
                {rows.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            aria-label={`${legend} item ${index + 1}`}
                            name={`${name}[${index}]`}
                            value={item}
                            onChange={(event) => {
                                const next = [...rows];
                                next[index] = event.target.value;
                                onChange(next);
                            }}
                        />
                        <Button
                            variant="ghost"
                            className="shrink-0 text-danger"
                            disabled={rows.length === 1}
                            onClick={() => onChange(rows.filter((_, i) => i !== index))}
                        >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Remove item {index + 1}</span>
                        </Button>
                    </div>
                ))}
            </div>

            <Button variant="secondary" size="sm" className="mt-3" onClick={() => onChange([...rows, ''])}>
                <Plus className="size-4" />
                Add item
            </Button>
        </fieldset>
    );
}

interface Props {
    data: LessonFormData;
    errors: Partial<Record<keyof LessonFormData, string>>;
    setData: <K extends keyof LessonFormData>(key: K, value: LessonFormData[K]) => void;
}

/** Shared by the lesson create and edit screens. */
export default function LessonFormFields({ data, errors, setData }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Lesson title" htmlFor="title" error={errors.title} required>
                    <Input
                        id="title"
                        required
                        aria-invalid={Boolean(errors.title)}
                        value={data.title}
                        onChange={(event) => setData('title', event.target.value)}
                    />
                </Field>

                <Field label="Content type" htmlFor="content_type" error={errors.content_type} required>
                    <Select
                        id="content_type"
                        value={data.content_type}
                        onChange={(event) => setData('content_type', event.target.value)}
                    >
                        {CONTENT_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </Select>
                </Field>

                <Field label="Duration (minutes)" htmlFor="duration_minutes" error={errors.duration_minutes} required>
                    <Input
                        id="duration_minutes"
                        type="number"
                        min={1}
                        required
                        aria-invalid={Boolean(errors.duration_minutes)}
                        value={data.duration_minutes}
                        onChange={(event) => setData('duration_minutes', Number(event.target.value))}
                    />
                </Field>

                <Field label="Display order" htmlFor="order" error={errors.order} hint="Lower numbers appear first.">
                    <Input
                        id="order"
                        type="number"
                        min={1}
                        aria-invalid={Boolean(errors.order)}
                        value={data.order}
                        onChange={(event) => setData('order', Number(event.target.value))}
                    />
                </Field>
            </div>

            <Field label="Summary" htmlFor="summary" error={errors.summary} hint="One line shown above the lesson.">
                <Textarea
                    id="summary"
                    rows={2}
                    aria-invalid={Boolean(errors.summary)}
                    value={data.summary}
                    onChange={(event) => setData('summary', event.target.value)}
                />
            </Field>

            <Field label="Lesson body" htmlFor="body" error={errors.body} hint="Markdown is supported." required>
                <Textarea
                    id="body"
                    rows={14}
                    required
                    aria-invalid={Boolean(errors.body)}
                    value={data.body}
                    onChange={(event) => setData('body', event.target.value)}
                    className="font-mono text-sm"
                />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Video URL" htmlFor="video_url" error={errors.video_url} hint="Optional embed URL.">
                    <Input
                        id="video_url"
                        type="url"
                        aria-invalid={Boolean(errors.video_url)}
                        value={data.video_url}
                        onChange={(event) => setData('video_url', event.target.value)}
                    />
                </Field>

                <Field label="Audio URL" htmlFor="audio_url" error={errors.audio_url} hint="Optional.">
                    <Input
                        id="audio_url"
                        type="url"
                        aria-invalid={Boolean(errors.audio_url)}
                        value={data.audio_url}
                        onChange={(event) => setData('audio_url', event.target.value)}
                    />
                </Field>
            </div>

            <StringListField
                legend="Key takeaways"
                hint="The points a caregiver should remember after this lesson."
                name="key_takeaways"
                items={data.key_takeaways}
                onChange={(items) => setData('key_takeaways', items)}
            />

            <StringListField
                legend="Clinical checklist"
                hint="Steps the caregiver can tick off while practising."
                name="clinical_checklist"
                items={data.clinical_checklist}
                onChange={(items) => setData('clinical_checklist', items)}
            />

            <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                    type="checkbox"
                    checked={data.is_published}
                    onChange={(event) => setData('is_published', event.target.checked)}
                    className="size-4 rounded border-line-strong text-accent focus:ring-accent"
                />
                Publish this lesson
            </label>
        </div>
    );
}
