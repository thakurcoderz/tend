import { Field, Input, Select, Textarea } from '@/components/ui';

export const COURSE_CATEGORIES = [
    'Dementia & Memory Care',
    'Elderly Home Care',
    'Pediatric & Special Needs',
    'Emergency & Safety',
    'Palliative & Hospice Care',
];

export const COURSE_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export interface CourseFormData {
    title: string;
    badge_title: string;
    category: string;
    level: string;
    summary: string;
    description: string;
    estimated_hours: number;
    thumbnail: string;
    is_published: boolean;
    order: number;
}

interface Props {
    data: CourseFormData;
    errors: Partial<Record<keyof CourseFormData, string>>;
    setData: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void;
}

/** Shared by the course create and edit screens so the two never drift apart. */
export default function CourseFormFields({ data, errors, setData }: Props) {
    return (
        <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Course title" htmlFor="title" error={errors.title} required>
                    <Input
                        id="title"
                        required
                        aria-invalid={Boolean(errors.title)}
                        value={data.title}
                        onChange={(event) => setData('title', event.target.value)}
                    />
                </Field>

                <Field
                    label="Badge title"
                    htmlFor="badge_title"
                    error={errors.badge_title}
                    hint="Shown on the certificate. Defaults to the course title."
                >
                    <Input
                        id="badge_title"
                        aria-invalid={Boolean(errors.badge_title)}
                        value={data.badge_title}
                        onChange={(event) => setData('badge_title', event.target.value)}
                    />
                </Field>

                <Field label="Category" htmlFor="category" error={errors.category} required>
                    <Select
                        id="category"
                        value={data.category}
                        onChange={(event) => setData('category', event.target.value)}
                    >
                        {COURSE_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </Select>
                </Field>

                <Field label="Level" htmlFor="level" error={errors.level} required>
                    <Select
                        id="level"
                        value={data.level}
                        onChange={(event) => setData('level', event.target.value)}
                    >
                        {COURSE_LEVELS.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </Select>
                </Field>

                <Field
                    label="Estimated hours"
                    htmlFor="estimated_hours"
                    error={errors.estimated_hours}
                    required
                >
                    <Input
                        id="estimated_hours"
                        type="number"
                        min={1}
                        required
                        aria-invalid={Boolean(errors.estimated_hours)}
                        value={data.estimated_hours}
                        onChange={(event) => setData('estimated_hours', Number(event.target.value))}
                    />
                </Field>

                <Field
                    label="Display order"
                    htmlFor="order"
                    error={errors.order}
                    hint="Lower numbers appear first."
                >
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

            <Field
                label="Thumbnail URL"
                htmlFor="thumbnail"
                error={errors.thumbnail}
                hint="Optional. A placeholder image is used when this is empty."
            >
                <Input
                    id="thumbnail"
                    type="url"
                    aria-invalid={Boolean(errors.thumbnail)}
                    value={data.thumbnail}
                    onChange={(event) => setData('thumbnail', event.target.value)}
                />
            </Field>

            <Field
                label="Summary"
                htmlFor="summary"
                error={errors.summary}
                hint="One or two sentences shown on the course card."
                required
            >
                <Textarea
                    id="summary"
                    rows={2}
                    required
                    aria-invalid={Boolean(errors.summary)}
                    value={data.summary}
                    onChange={(event) => setData('summary', event.target.value)}
                />
            </Field>

            <Field
                label="Full description"
                htmlFor="description"
                error={errors.description}
                hint="Markdown is supported."
                required
            >
                <Textarea
                    id="description"
                    rows={6}
                    required
                    aria-invalid={Boolean(errors.description)}
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                />
            </Field>

            <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                    type="checkbox"
                    checked={data.is_published}
                    onChange={(event) => setData('is_published', event.target.checked)}
                    className="size-4 rounded border-line-strong text-accent focus:ring-accent"
                />
                Publish this course so caregivers can enrol
            </label>
        </div>
    );
}
