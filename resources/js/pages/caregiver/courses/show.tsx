import { Link, useForm } from '@inertiajs/react';
import { ArrowRight, Award, CheckCircle2, Clock, Play } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Badge, Button, ButtonLink, Card, PageHeader, Progress } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { Certificate, Course, Enrollment, QuizAttempt } from '@/types';

interface Props {
    course: Course;
    isEnrolled: boolean;
    enrollment?: Enrollment | null;
    completedLessonIds: number[];
    quizAttempts: Record<string, QuizAttempt[]>;
    certificate?: Certificate | null;
}

export default function CourseShow({
    course,
    isEnrolled,
    enrollment,
    completedLessonIds,
    quizAttempts,
    certificate,
}: Props) {
    const { post, processing } = useForm();

    const firstLesson = course.modules?.[0]?.lessons?.[0];
    const firstModule = course.modules?.[0];

    return (
        <CaregiverLayout title={course.title}>
            <PageHeader
                breadcrumb={
                    <Link href="/caregiver/courses" className="hover:text-accent-ink">
                        Programs
                    </Link>
                }
                title={course.title}
                actions={
                    isEnrolled ? (
                        firstLesson && firstModule ? (
                            <ButtonLink
                                href={`/caregiver/learn/${course.slug}/${firstModule.slug}/${firstLesson.slug}`}
                            >
                                <Play className="size-4" />
                                {completedLessonIds.length > 0 ? 'Continue' : 'Start'} learning
                            </ButtonLink>
                        ) : null
                    ) : (
                        <Button
                            onClick={() => post(`/caregiver/courses/${course.id}/enroll`)}
                            disabled={processing}
                        >
                            {processing ? 'Enrolling...' : 'Enrol for free'}
                        </Button>
                    )
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <Badge tone="accent">{course.category}</Badge>
                        <Badge tone="neutral">{course.level}</Badge>
                        <span className="inline-flex items-center gap-1.5 text-sm text-ink-subtle">
                            <Clock className="size-4" />
                            {course.estimated_hours} hours
                        </span>
                    </div>

                    <div className="markdown-content mt-5">
                        <MarkdownRenderer content={course.description || course.summary || ''} />
                    </div>
                </div>

                <div className="space-y-4">
                    {certificate ? (
                        <Card className="border-ok-line bg-ok-soft p-5">
                            <div className="flex items-center gap-2.5">
                                <Award className="size-5 shrink-0 text-ok" />
                                <p className="font-semibold text-ink">Certificate earned</p>
                            </div>
                            <p className="mt-2 font-mono text-sm text-ink-muted">
                                {certificate.certificate_number}
                            </p>
                            <ButtonLink
                                href={`/caregiver/certificates/${certificate.certificate_number}`}
                                variant="secondary"
                                size="sm"
                                className="mt-4"
                            >
                                View certificate
                            </ButtonLink>
                        </Card>
                    ) : null}

                    {isEnrolled && enrollment ? (
                        <Card className="p-5">
                            <Progress label="Your progress" value={enrollment.progress_percentage} />
                            <p className="mt-3 text-sm text-ink-muted">
                                {completedLessonIds.length} lessons completed.
                            </p>
                        </Card>
                    ) : null}
                </div>
            </div>

            <section aria-labelledby="curriculum-heading" className="mt-10">
                <h2 id="curriculum-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                    Curriculum
                </h2>

                <div className="space-y-4">
                    {course.modules?.map((module, moduleIndex) => {
                        const quiz = module.quiz;
                        const attempts = quiz ? (quizAttempts[quiz.id] ?? []) : [];
                        const hasPassed = attempts.some((attempt) => attempt.passed);

                        return (
                            <Card key={module.id} as="section" className="overflow-hidden">
                                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-surface-muted px-5 py-4">
                                    <div className="min-w-0">
                                        <p className="tabular text-sm font-medium text-ink-subtle">
                                            Module {moduleIndex + 1}
                                        </p>
                                        <h3 className="mt-0.5 font-semibold text-ink">{module.title}</h3>
                                        {module.description ? (
                                            <p className="mt-1 text-sm text-ink-muted">{module.description}</p>
                                        ) : null}
                                    </div>
                                    <span className="shrink-0 text-sm text-ink-subtle">
                                        {module.estimated_minutes} min
                                    </span>
                                </div>

                                <ul className="divide-y divide-line">
                                    {module.lessons?.map((lesson, lessonIndex) => {
                                        const isCompleted = completedLessonIds.includes(lesson.id);

                                        return (
                                            <li
                                                key={lesson.id}
                                                className="group relative flex items-center gap-4 px-5 py-4 transition hover:bg-surface-muted"
                                            >
                                                <span
                                                    className={`tabular flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                                                        isCompleted
                                                            ? 'bg-ok-soft text-ok'
                                                            : 'bg-surface-muted text-ink-subtle'
                                                    }`}
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="size-4.5" />
                                                    ) : (
                                                        lessonIndex + 1
                                                    )}
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-ink">
                                                        <Link
                                                            href={`/caregiver/learn/${course.slug}/${module.slug}/${lesson.slug}`}
                                                            className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                                        >
                                                            {lesson.title}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-sm text-ink-subtle">
                                                        {lesson.duration_minutes} min ·{' '}
                                                        {lesson.content_type.replace('_', ' ')}
                                                    </p>
                                                </div>

                                                <ArrowRight className="size-4 shrink-0 text-ink-subtle" />
                                            </li>
                                        );
                                    })}

                                    {quiz ? (
                                        <li className="group relative flex items-center gap-4 px-5 py-4 transition hover:bg-surface-muted">
                                            <span
                                                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                                                    hasPassed ? 'bg-ok-soft text-ok' : 'bg-accent-soft text-accent-ink'
                                                }`}
                                            >
                                                <Award className="size-4" />
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <h4 className="flex flex-wrap items-center gap-2 font-medium text-ink">
                                                    <Link
                                                        href={`/caregiver/quizzes/${quiz.id}`}
                                                        className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                                    >
                                                        {quiz.title}
                                                    </Link>
                                                    {hasPassed ? <Badge tone="ok">Passed</Badge> : null}
                                                </h4>
                                                <p className="text-sm text-ink-subtle">
                                                    Pass mark {quiz.passing_score}%
                                                    {quiz.questions_count
                                                        ? ` · ${quiz.questions_count} questions`
                                                        : ''}
                                                </p>
                                            </div>

                                            <ArrowRight className="size-4 shrink-0 text-ink-subtle" />
                                        </li>
                                    ) : null}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            </section>
        </CaregiverLayout>
    );
}
