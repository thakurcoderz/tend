import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, Square } from 'lucide-react';
import { useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Badge, Button, ButtonLink, Card, Progress } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { Course, Lesson, Module } from '@/types';

interface LessonNav {
    id: number;
    title: string;
    slug: string;
    module_slug: string;
    module_title: string;
}

interface Props {
    course: Course;
    module: Module;
    lesson: Lesson;
    isCompleted: boolean;
    completedLessonIds: number[];
    prevLesson?: LessonNav | null;
    nextLesson?: LessonNav | null;
}

export default function LessonViewer({
    course,
    module,
    lesson,
    isCompleted,
    completedLessonIds,
    prevLesson,
    nextLesson,
}: Props) {
    const { post, processing } = useForm();
    // Checklist ticks are a reading aid for the caregiver, not persisted progress.
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    const toggleItem = (index: number) =>
        setCheckedItems((current) =>
            current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
        );

    const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0) ?? 0;
    const progress = totalLessons > 0 ? (completedLessonIds.length / totalLessons) * 100 : 0;

    return (
        <CaregiverLayout title={lesson.title}>
            <div className="mx-auto max-w-3xl">
                <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
                    <Link href={`/caregiver/courses/${course.slug}`} className="hover:text-accent-ink hover:underline">
                        {course.title}
                    </Link>
                    <span className="text-ink-faint" aria-hidden="true">
                        /
                    </span>
                    <span className="font-medium text-ink-muted">{module.title}</span>
                    <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-subtle sm:inline-flex">
                        <Clock className="size-3.5" /> {lesson.duration_minutes} min read
                    </span>
                </nav>

                <div className="mb-8 rounded-card border border-line bg-surface p-4 shadow-xs">
                    <Progress label="Course progress" value={progress} />
                    <p className="mt-2 text-xs text-ink-subtle">
                        {completedLessonIds.length} of {totalLessons} lessons completed •{' '}
                        {isCompleted ? 'This lesson completed' : 'Mark complete when finished'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <Badge tone="neutral">{lesson.content_type.replace('_', ' ')}</Badge>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">
                        <Clock className="size-3.5" />
                        {lesson.duration_minutes} min
                    </span>
                    {isCompleted ? (
                        <Badge tone="ok">
                            <CheckCircle2 className="size-3.5" />
                            Completed
                        </Badge>
                    ) : (
                        <Badge tone="accent">In progress</Badge>
                    )}
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-[1.875rem]">{lesson.title}</h1>
                {lesson.summary ? <p className="mt-3 text-lg leading-relaxed text-ink-muted">{lesson.summary}</p> : null}

                {lesson.video_url ? (
                    <div className="mt-8 overflow-hidden rounded-card border border-line">
                        <iframe
                            src={lesson.video_url}
                            title={`Video for ${lesson.title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="aspect-video w-full"
                        />
                    </div>
                ) : null}

                <div className="markdown-content mt-8">
                    <MarkdownRenderer content={lesson.body} />
                </div>

                {lesson.key_takeaways && lesson.key_takeaways.length > 0 ? (
                    <Card as="section" aria-labelledby="takeaways-heading" className="mt-10 p-6">
                        <h2 id="takeaways-heading" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
                            <span className="flex size-6 items-center justify-center rounded-full bg-accent-soft text-accent-ink ring-1 ring-accent-line">
                                <Check className="size-3.5" />
                            </span>
                            Key takeaways
                        </h2>
                        <ul className="mt-4 space-y-2.5">
                            {lesson.key_takeaways.map((item, idx) => (
                                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-ink-subtle ring-1 ring-line">
                                        {idx + 1}
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ) : null}

                {lesson.clinical_checklist && lesson.clinical_checklist.length > 0 ? (
                    <Card as="section" aria-labelledby="checklist-heading" className="mt-6 p-6">
                        <h2 id="checklist-heading" className="font-semibold tracking-tight text-ink">
                            Clinical checklist
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                            Tick items off as you practise. This is for your own reference and is not saved.
                        </p>
                        <ul className="mt-4 space-y-1">
                            {lesson.clinical_checklist.map((item, index) => {
                                const isChecked = checkedItems.includes(index);

                                return (
                                    <li key={item}>
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(index)}
                                            aria-pressed={isChecked}
                                            className="flex min-h-11 w-full items-start gap-3 rounded-control px-2 py-2.5 text-left text-sm leading-relaxed transition hover:bg-surface-muted"
                                        >
                                            {isChecked ? (
                                                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ok" />
                                            ) : (
                                                <Square className="mt-0.5 size-5 shrink-0 text-ink-subtle" />
                                            )}
                                            <span className={isChecked ? 'text-ink-subtle line-through' : 'text-ink'}>
                                                {item}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </Card>
                ) : null}

                <div className="mt-10 rounded-card border border-line bg-surface-muted/60 p-4 sm:p-5">
                    {isCompleted ? (
                        <p className="flex items-center gap-2 font-medium text-ok">
                            <CheckCircle2 className="size-5" />
                            You have completed this lesson.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-muted">
                                Finished reading? Mark it complete to track your progress.
                            </p>
                            <Button size="lg" onClick={() => post(`/caregiver/learn/lessons/${lesson.id}/complete`)} disabled={processing} className="shrink-0">
                                <Check className="size-4" />
                                {processing ? 'Saving...' : 'Mark lesson complete'}
                            </Button>
                        </div>
                    )}
                </div>

                <nav aria-label="Lesson navigation" className="mt-8 flex flex-wrap justify-between gap-3">
                    {prevLesson ? (
                        <ButtonLink
                            variant="secondary"
                            href={`/caregiver/learn/${course.slug}/${prevLesson.module_slug}/${prevLesson.slug}`}
                        >
                            <ArrowLeft className="size-4" />
                            Previous
                        </ButtonLink>
                    ) : (
                        <span />
                    )}

                    {nextLesson ? (
                        <ButtonLink
                            href={`/caregiver/learn/${course.slug}/${nextLesson.module_slug}/${nextLesson.slug}`}
                        >
                            Next lesson
                            <ArrowRight className="size-4" />
                        </ButtonLink>
                    ) : (
                        <ButtonLink href={`/caregiver/courses/${course.slug}`}>
                            Back to course
                            <ArrowRight className="size-4" />
                        </ButtonLink>
                    )}
                </nav>
            </div>
        </CaregiverLayout>
    );
}
