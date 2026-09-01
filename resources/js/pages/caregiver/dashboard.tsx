import { Link, usePage } from '@inertiajs/react';
import { Award, BookOpen, CheckCircle2, Clock, Compass, FileText, Play } from 'lucide-react';
import {
    Badge,
    ButtonLink,
    Card,
    EmptyState,
    PageHeader,
    Progress,
    Stat,
} from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { ActivityLog, Certificate, Course, Enrollment, SharedProps } from '@/types';

interface Props {
    stats: {
        enrolledCount: number;
        inProgressCount: number;
        completedCount: number;
        lessonsCompleted: number;
        certificatesCount: number;
        passedQuizzes: number;
    };
    activeEnrollments: Enrollment[];
    recentCertificates: Certificate[];
    recentActivities: ActivityLog[];
    recommendedCourses: Course[];
}

export default function Dashboard({
    stats,
    activeEnrollments,
    recentCertificates,
    recentActivities,
    recommendedCourses,
}: Props) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;
    const nextCourse = activeEnrollments[0]?.course;

    return (
        <CaregiverLayout title="My learning">
            <PageHeader
                eyebrow={`${stats.enrolledCount} programs • ${stats.certificatesCount} credentials`}
                title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'there'}`}
                description="Pick up where you left off, or start something new. All content is phone-friendly and saves automatically."
                actions={
                    nextCourse ? (
                        <ButtonLink href={`/caregiver/courses/${nextCourse.slug}`}>
                            <Play className="size-4" />
                            Continue learning
                        </ButtonLink>
                    ) : (
                        <ButtonLink href="/caregiver/courses">
                            <Compass className="size-4" />
                            Browse programs
                        </ButtonLink>
                    )
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                    label="In progress"
                    value={stats.inProgressCount}
                    hint={`${stats.enrolledCount} enrolled`}
                    icon={<BookOpen className="size-5" />}
                />
                <Stat
                    label="Completed"
                    value={stats.completedCount}
                    hint={stats.completedCount > 0 ? 'Eligible for certificate' : 'Finish assessment to earn'}
                    icon={<CheckCircle2 className="size-5" />}
                />
                <Stat
                    label="Lessons finished"
                    value={stats.lessonsCompleted}
                    hint={`${stats.passedQuizzes} assessments passed`}
                    icon={<FileText className="size-5" />}
                />
                <Stat
                    label="Certificates"
                    value={stats.certificatesCount}
                    hint={stats.certificatesCount > 0 ? 'Verifiable at /verify' : 'Pass at 80% to earn'}
                    icon={<Award className="size-5" />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section aria-labelledby="active-heading">
                        <div className="mb-4 flex items-baseline justify-between gap-4">
                            <h2 id="active-heading" className="text-lg font-semibold tracking-tight text-ink">
                                Continue learning
                            </h2>
                            <Link
                                href="/caregiver/courses"
                                className="text-sm font-medium text-accent-ink underline-offset-2 hover:underline"
                            >
                                All programs
                            </Link>
                        </div>

                        {activeEnrollments.length > 0 ? (
                            <ul className="space-y-3">
                                {activeEnrollments.map((enrollment) => {
                                    const course = enrollment.course;

                                    if (!course) {
                                        return null;
                                    }

                                    return (
                                        <li key={enrollment.id}>
                                            <Card className="group relative p-5 transition hover:shadow-sm">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <Badge tone="accent">{course.category}</Badge>
                                                        <h3 className="mt-2 font-semibold text-ink">
                                                            <Link
                                                                href={`/caregiver/courses/${course.slug}`}
                                                                className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                                            >
                                                                {course.title}
                                                            </Link>
                                                        </h3>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1.5 text-sm text-ink-subtle">
                                                        <Clock className="size-4" />
                                                        {course.estimated_hours}h
                                                    </span>
                                                </div>

                                                <Progress
                                                    className="mt-4"
                                                    label="Progress"
                                                    value={enrollment.progress_percentage}
                                                />
                                            </Card>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <EmptyState
                                icon={<Compass className="size-5" />}
                                title="No programs in progress"
                                description="Enrol in a certification program to start building your credentials."
                                action={<ButtonLink href="/caregiver/courses">Browse programs</ButtonLink>}
                            />
                        )}
                    </section>

                    {recommendedCourses.length > 0 ? (
                        <section aria-labelledby="recommended-heading">
                            <h2
                                id="recommended-heading"
                                className="mb-4 text-lg font-semibold tracking-tight text-ink"
                            >
                                Recommended for you
                            </h2>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {recommendedCourses.map((course) => (
                                    <Card key={course.id} className="group relative p-5 transition hover:shadow-sm">
                                        <Badge tone="neutral">{course.category}</Badge>
                                        <h3 className="mt-2 font-semibold text-ink">
                                            <Link
                                                href={`/caregiver/courses/${course.slug}`}
                                                className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                            >
                                                {course.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{course.summary}</p>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>

                <div className="space-y-6">
                    <Card as="section" aria-labelledby="certificates-heading" className="p-5">
                        <div className="mb-4 flex items-baseline justify-between gap-3">
                            <h2 id="certificates-heading" className="font-semibold text-ink">
                                Certificates
                            </h2>
                            <Link
                                href="/caregiver/certificates"
                                className="text-sm font-medium text-accent-ink underline-offset-2 hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {recentCertificates.length > 0 ? (
                            <ul className="divide-y divide-line">
                                {recentCertificates.map((certificate) => (
                                    <li key={certificate.id} className="py-3 first:pt-0 last:pb-0">
                                        <Link
                                            href={`/caregiver/certificates/${certificate.certificate_number}`}
                                            className="group block"
                                        >
                                            <p className="font-medium text-ink group-hover:text-accent-ink">
                                                {certificate.title}
                                            </p>
                                            <p className="mt-0.5 flex items-center justify-between gap-2 text-sm text-ink-subtle">
                                                <span className="truncate font-mono">
                                                    {certificate.certificate_number}
                                                </span>
                                                {certificate.grade_percentage != null ? (
                                                    <span className="tabular shrink-0 font-medium text-ok">
                                                        {certificate.grade_percentage}%
                                                    </span>
                                                ) : null}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-ink-muted">
                                Pass a final assessment to earn your first certificate.
                            </p>
                        )}
                    </Card>

                    <Card as="section" aria-labelledby="activity-heading" className="p-5">
                        <h2 id="activity-heading" className="mb-4 font-semibold text-ink">
                            Recent activity
                        </h2>

                        {recentActivities.length > 0 ? (
                            <ul className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <li key={activity.id} className="border-l-2 border-accent-line pl-3">
                                        <p className="text-sm text-ink">{activity.description}</p>
                                        <p className="mt-0.5 text-sm text-ink-subtle">
                                            {new Date(activity.created_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-ink-muted">Your recent activity will show up here.</p>
                        )}
                    </Card>
                </div>
            </div>
        </CaregiverLayout>
    );
}
