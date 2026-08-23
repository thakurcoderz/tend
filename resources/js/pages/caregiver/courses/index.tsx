import { Link, router } from '@inertiajs/react';
import { CheckCircle2, Clock, Compass, Layers } from 'lucide-react';
import { Badge, Card, EmptyState, PageHeader, Progress } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import { cn } from '@/lib/utils';
import type { Course } from '@/types';

interface Props {
    courses: Course[];
    categories: string[];
    selectedCategory: string;
}

export default function CoursesIndex({ courses, categories, selectedCategory }: Props) {
    const selectCategory = (category: string) =>
        router.get('/caregiver/courses', category === 'All' ? {} : { category }, { preserveState: true });

    const activeCategory = selectedCategory || 'All';

    return (
        <CaregiverLayout title="Browse programs">
            <PageHeader
                title="Browse programs"
                description="Enrol in a certification program and work through it at your own pace."
            />

            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {categories.map((category) => {
                    const isActive = activeCategory === category;

                    return (
                        <button
                            key={category}
                            type="button"
                            onClick={() => selectCategory(category)}
                            aria-pressed={isActive}
                            className={cn('btn btn-sm', isActive ? 'btn-primary' : 'btn-secondary')}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>

            {courses.length === 0 ? (
                <EmptyState
                    icon={<Compass className="size-5" />}
                    title="No programs here"
                    description="Try another category to see what else is available."
                    action={
                        <button type="button" onClick={() => selectCategory('All')} className="btn btn-primary">
                            Show all programs
                        </button>
                    }
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            as="article"
                            className="group relative flex flex-col p-5 transition hover:shadow-sm"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="accent">{course.category}</Badge>
                                {course.is_enrolled ? (
                                    <Badge tone={course.enrollment_status === 'completed' ? 'ok' : 'info'}>
                                        {course.enrollment_status === 'completed' ? (
                                            <>
                                                <CheckCircle2 className="size-3.5" />
                                                Completed
                                            </>
                                        ) : (
                                            'In progress'
                                        )}
                                    </Badge>
                                ) : null}
                            </div>

                            <h2 className="mt-3 font-semibold tracking-tight text-ink">
                                <Link
                                    href={`/caregiver/courses/${course.slug}`}
                                    className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                >
                                    {course.title}
                                </Link>
                            </h2>

                            <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-muted">{course.summary}</p>

                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-subtle">
                                <span className="inline-flex items-center gap-1.5">
                                    <Layers className="size-4" />
                                    {course.modules_count ?? 0} modules
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="size-4" />
                                    {course.estimated_hours}h
                                </span>
                            </div>

                            {course.is_enrolled && course.progress_percentage != null ? (
                                <Progress className="mt-4" label="Progress" value={course.progress_percentage} />
                            ) : null}
                        </Card>
                    ))}
                </div>
            )}
        </CaregiverLayout>
    );
}
