import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Award, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useState  } from 'react';
import type {FormEvent} from 'react';
import CourseFormFields from '@/components/admin/CourseFormFields';
import { Badge, Button, ButtonLink, Card, Field, Input, PageHeader, Textarea } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { Course, Module } from '@/types';

interface Props {
    course: Course & {
        modules: (Module & {
            lessons: {
                id: number;
                title: string;
                content_type: string;
                duration_minutes: number;
                is_published: boolean;
            }[];
            quiz?: {
                id: number;
                title: string;
                questions_count?: number;
            } | null;
        })[];
    };
}

export default function CourseEdit({ course }: Props) {
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [moduleTitle, setModuleTitle] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const [moduleMinutes, setModuleMinutes] = useState(30);

    const { data, setData, put, processing, errors } = useForm({
        title: course.title,
        badge_title: course.badge_title || '',
        category: course.category,
        level: course.level,
        summary: course.summary,
        description: course.description,
        estimated_hours: course.estimated_hours,
        thumbnail: course.thumbnail || '',
        is_published: course.is_published,
        order: course.order,
    });

    const handleSaveCourse = (event: FormEvent) => {
        event.preventDefault();
        put(`/admin/courses/${course.id}`);
    };

    const handleCreateModule = (event: FormEvent) => {
        event.preventDefault();
        router.post(
            `/admin/courses/${course.id}/modules`,
            { title: moduleTitle, description: moduleDescription, estimated_minutes: moduleMinutes },
            {
                onSuccess: () => {
                    setShowModuleForm(false);
                    setModuleTitle('');
                    setModuleDescription('');
                    setModuleMinutes(30);
                },
            },
        );
    };

    const confirmDelete = (message: string, url: string) => {
        if (window.confirm(message)) {
            router.delete(url);
        }
    };

    return (
        <AdminLayout title={course.title}>
            <PageHeader
                breadcrumb={
                    <Link href="/admin/courses" className="inline-flex items-center gap-1.5 hover:text-accent-ink">
                        <ArrowLeft className="size-4" />
                        Courses
                    </Link>
                }
                title={course.title}
                actions={
                    <Badge tone={course.is_published ? 'ok' : 'neutral'}>
                        {course.is_published ? 'Published' : 'Draft'}
                    </Badge>
                }
            />

            <div className="grid gap-8 lg:grid-cols-5">
                <form onSubmit={handleSaveCourse} className="lg:col-span-3" noValidate>
                    <Card as="section" aria-labelledby="details-heading" className="p-6">
                        <h2 id="details-heading" className="mb-5 font-semibold text-ink">
                            Course details
                        </h2>
                        <CourseFormFields data={data} errors={errors} setData={setData} />
                    </Card>

                    <div className="mt-6">
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>

                <section aria-labelledby="curriculum-heading" className="lg:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 id="curriculum-heading" className="font-semibold text-ink">
                            Curriculum
                        </h2>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowModuleForm((open) => !open)}
                            aria-expanded={showModuleForm}
                        >
                            <PlusCircle className="size-4" />
                            Add module
                        </Button>
                    </div>

                    {showModuleForm ? (
                        <Card className="mb-4 p-5">
                            <form onSubmit={handleCreateModule} className="space-y-4">
                                <Field label="Module title" htmlFor="module_title" required>
                                    <Input
                                        id="module_title"
                                        required
                                        value={moduleTitle}
                                        onChange={(event) => setModuleTitle(event.target.value)}
                                    />
                                </Field>

                                <Field label="Description" htmlFor="module_description">
                                    <Textarea
                                        id="module_description"
                                        rows={2}
                                        value={moduleDescription}
                                        onChange={(event) => setModuleDescription(event.target.value)}
                                    />
                                </Field>

                                <Field label="Estimated minutes" htmlFor="module_minutes">
                                    <Input
                                        id="module_minutes"
                                        type="number"
                                        min={1}
                                        value={moduleMinutes}
                                        onChange={(event) => setModuleMinutes(Number(event.target.value))}
                                    />
                                </Field>

                                <div className="flex gap-2">
                                    <Button type="submit" size="sm">
                                        Add module
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowModuleForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : null}

                    {course.modules.length === 0 ? (
                        <Card className="p-6">
                            <p className="text-ink-muted">
                                No modules yet. Add one to start building the curriculum.
                            </p>
                        </Card>
                    ) : (
                        <ol className="space-y-4">
                            {course.modules.map((module, index) => (
                                <li key={module.id}>
                                    <Card className="overflow-hidden">
                                        <div className="flex items-start justify-between gap-3 border-b border-line bg-surface-muted px-4 py-3">
                                            <div className="min-w-0">
                                                <p className="tabular text-sm text-ink-subtle">
                                                    Module {index + 1}
                                                </p>
                                                <h3 className="font-medium text-ink">{module.title}</h3>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    confirmDelete(
                                                        `Delete module "${module.title}" and all its lessons?`,
                                                        `/admin/modules/${module.id}`,
                                                    )
                                                }
                                                className="btn btn-ghost btn-sm shrink-0 text-danger"
                                            >
                                                <Trash2 className="size-4" />
                                                <span className="sr-only">Delete {module.title}</span>
                                            </button>
                                        </div>

                                        <ul className="divide-y divide-line">
                                            {(module.lessons ?? []).map((lesson) => (
                                                <li
                                                    key={lesson.id}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm"
                                                >
                                                    <span className="min-w-0 flex-1 truncate text-ink">
                                                        {lesson.title}
                                                    </span>
                                                    <span className="shrink-0 text-ink-subtle">
                                                        {lesson.duration_minutes}m
                                                    </span>
                                                    <Link
                                                        href={`/admin/lessons/${lesson.id}/edit`}
                                                        className="btn btn-ghost btn-sm shrink-0"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                        <span className="sr-only">Edit {lesson.title}</span>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            confirmDelete(
                                                                `Delete lesson "${lesson.title}"?`,
                                                                `/admin/lessons/${lesson.id}`,
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-sm shrink-0 text-danger"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                        <span className="sr-only">Delete {lesson.title}</span>
                                                    </button>
                                                </li>
                                            ))}

                                            {module.quiz ? (
                                                <li className="flex items-center gap-2 bg-accent-soft/50 px-4 py-2.5 text-sm">
                                                    <Award className="size-4 shrink-0 text-accent" />
                                                    <span className="min-w-0 flex-1 truncate text-ink">
                                                        {module.quiz.title}
                                                    </span>
                                                    <Link
                                                        href={`/admin/quizzes/${module.quiz.id}/edit`}
                                                        className="btn btn-ghost btn-sm shrink-0"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                        <span className="sr-only">Edit assessment</span>
                                                    </Link>
                                                </li>
                                            ) : null}
                                        </ul>

                                        <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
                                            <ButtonLink
                                                href={`/admin/modules/${module.id}/lessons/create`}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                <PlusCircle className="size-3.5" />
                                                Lesson
                                            </ButtonLink>
                                            {!module.quiz ? (
                                                <ButtonLink
                                                    href={`/admin/modules/${module.id}/quizzes/create`}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    <PlusCircle className="size-3.5" />
                                                    Assessment
                                                </ButtonLink>
                                            ) : null}
                                        </div>
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
