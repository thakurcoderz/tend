import { Link, router } from '@inertiajs/react';
import { ChevronDown, Clock, Layers } from 'lucide-react';
import { useState } from 'react';
import { Badge, ButtonLink, Card, EmptyState, Section } from '@/components/ui';
import GuestLayout from '@/layouts/GuestLayout';
import { cn } from '@/lib/utils';
import type { Course } from '@/types';

interface Props {
    courses: Course[];
    categories: string[];
    selectedCategory: string;
}

export default function Programs({ courses, categories, selectedCategory }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(courses[0]?.id ?? null);

    const selectCategory = (category: string) =>
        router.get('/programs', category === 'All' ? {} : { category }, { preserveState: true });

    const activeCategory = selectedCategory || 'All';

    return (
        <GuestLayout title="Certification programs">
            <Section>
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                        Certification programs
                    </h1>
                    <p className="mt-3 text-ink-muted">
                        Self-paced clinical training with scenario-based assessment and a verifiable credential.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
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
                        icon={<Layers className="size-5" />}
                        title="No programs in this category"
                        description="Try a different category, or view everything on offer."
                        action={
                            <button type="button" onClick={() => selectCategory('All')} className="btn btn-primary">
                                Show all programs
                            </button>
                        }
                    />
                ) : (
                    <ul className="mt-8 space-y-4">
                        {courses.map((course) => {
                            const isExpanded = expandedId === course.id;
                            const modules = course.modules ?? [];

                            return (
                                <li key={course.id}>
                                    <Card className="overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge tone="accent">{course.category}</Badge>
                                                <Badge tone="neutral">{course.level}</Badge>
                                            </div>

                                            <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                                                {course.title}
                                            </h2>
                                            <p className="mt-2 max-w-[70ch] text-ink-muted">
                                                {course.description || course.summary}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-subtle">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Clock className="size-4" />
                                                    {course.estimated_hours} hours
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Layers className="size-4" />
                                                    {modules.length} modules
                                                </span>
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-2">
                                                <ButtonLink href="/register">Enrol in this program</ButtonLink>
                                                {modules.length > 0 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedId(isExpanded ? null : course.id)}
                                                        aria-expanded={isExpanded}
                                                        aria-controls={`modules-${course.id}`}
                                                        className="btn btn-secondary"
                                                    >
                                                        {isExpanded ? 'Hide' : 'Preview'} curriculum
                                                        <ChevronDown
                                                            className={cn(
                                                                'size-4 transition-transform',
                                                                isExpanded && 'rotate-180',
                                                            )}
                                                        />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>

                                        {isExpanded && modules.length > 0 ? (
                                            <ol
                                                id={`modules-${course.id}`}
                                                className="divide-y divide-line border-t border-line bg-surface-muted"
                                            >
                                                {modules.map((module, index) => (
                                                    <li
                                                        key={module.id}
                                                        className="flex items-baseline gap-3 px-6 py-3 text-sm"
                                                    >
                                                        <span className="tabular w-6 shrink-0 font-medium text-ink-subtle">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </span>
                                                        <span className="flex-1 font-medium text-ink">
                                                            {module.title}
                                                        </span>
                                                        <span className="shrink-0 text-ink-subtle">
                                                            {module.estimated_minutes} min
                                                        </span>
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : null}
                                    </Card>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Section>

            <Section width="prose" className="border-t border-line bg-surface text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-ink">Not sure where to start?</h2>
                <p className="mx-auto mt-3 max-w-[52ch] text-ink-muted">
                    Read how certification works, or ask us which program fits your role.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <ButtonLink href="/how-it-works" variant="secondary">
                        How it works
                    </ButtonLink>
                    <Link href="/contact" className="btn btn-ghost">
                        Contact us
                    </Link>
                </div>
            </Section>
        </GuestLayout>
    );
}
