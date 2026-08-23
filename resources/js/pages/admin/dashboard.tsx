import { Link } from '@inertiajs/react';
import { Award, BookOpen, Layers, PlusCircle, TrendingUp, Users } from 'lucide-react';
import { Badge, ButtonLink, Card, PageHeader, Stat } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { ActivityLog, Certificate, Course } from '@/types';

interface Metrics {
    caregiversCount: number;
    coursesCount: number;
    modulesCount: number;
    lessonsCount: number;
    quizzesCount: number;
    certificatesIssued: number;
    totalEnrollments: number;
    completedEnrollments: number;
    avgScore: number;
    passRate: number;
}

interface Props {
    metrics: Metrics;
    recentActivities: ActivityLog[];
    recentCertificates: Certificate[];
    coursesSummary: (Course & { modules_count: number; lessons_count: number; enrollments_count: number })[];
}

export default function AdminDashboard({
    metrics,
    recentActivities,
    recentCertificates,
    coursesSummary,
}: Props) {
    return (
        <AdminLayout title="Dashboard">
            <PageHeader
                title="Dashboard"
                description="Enrolment, assessment, and credential activity across all programs."
                actions={
                    <ButtonLink href="/admin/courses/create">
                        <PlusCircle className="size-4" />
                        New course
                    </ButtonLink>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                    label="Caregivers"
                    value={metrics.caregiversCount}
                    hint={`${metrics.totalEnrollments} enrolments`}
                    icon={<Users className="size-5" />}
                />
                <Stat
                    label="Courses"
                    value={metrics.coursesCount}
                    hint={`${metrics.modulesCount} modules, ${metrics.lessonsCount} lessons`}
                    icon={<Layers className="size-5" />}
                />
                <Stat
                    label="Certificates issued"
                    value={metrics.certificatesIssued}
                    hint={`${metrics.completedEnrollments} completions`}
                    icon={<Award className="size-5" />}
                />
                <Stat
                    label="Pass rate"
                    value={`${metrics.passRate}%`}
                    hint={`Average score ${metrics.avgScore}%`}
                    icon={<TrendingUp className="size-5" />}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <section aria-labelledby="courses-heading" className="lg:col-span-2">
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                        <h2 id="courses-heading" className="text-lg font-semibold tracking-tight text-ink">
                            Courses
                        </h2>
                        <Link
                            href="/admin/courses"
                            className="text-sm font-medium text-accent-ink underline-offset-2 hover:underline"
                        >
                            Manage all
                        </Link>
                    </div>

                    {coursesSummary.length > 0 ? (
                        <div className="table-wrap">
                            <table className="tbl">
                                <caption className="sr-only">Courses with module, lesson, and enrolment counts</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Course</th>
                                        <th scope="col">Modules</th>
                                        <th scope="col">Lessons</th>
                                        <th scope="col">Enrolled</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coursesSummary.map((course) => (
                                        <tr key={course.id}>
                                            <td>
                                                <Link
                                                    href={`/admin/courses/${course.id}/edit`}
                                                    className="font-medium text-ink hover:text-accent-ink"
                                                >
                                                    {course.title}
                                                </Link>
                                                <span className="block text-sm text-ink-subtle">
                                                    {course.category}
                                                </span>
                                            </td>
                                            <td className="tabular">{course.modules_count}</td>
                                            <td className="tabular">{course.lessons_count}</td>
                                            <td className="tabular">{course.enrollments_count}</td>
                                            <td>
                                                <Badge tone={course.is_published ? 'ok' : 'neutral'}>
                                                    {course.is_published ? 'Published' : 'Draft'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <Card className="p-6">
                            <p className="text-ink-muted">No courses yet.</p>
                            <ButtonLink href="/admin/courses/create" className="mt-4">
                                <BookOpen className="size-4" />
                                Create the first course
                            </ButtonLink>
                        </Card>
                    )}
                </section>

                <div className="space-y-6">
                    <Card as="section" aria-labelledby="certs-heading" className="p-5">
                        <div className="mb-4 flex items-baseline justify-between gap-3">
                            <h2 id="certs-heading" className="font-semibold text-ink">
                                Recent certificates
                            </h2>
                            <Link
                                href="/admin/certificates"
                                className="text-sm font-medium text-accent-ink underline-offset-2 hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {recentCertificates.length > 0 ? (
                            <ul className="divide-y divide-line">
                                {recentCertificates.map((certificate) => (
                                    <li key={certificate.id} className="py-3 first:pt-0 last:pb-0">
                                        <p className="font-medium text-ink">{certificate.title}</p>
                                        <p className="mt-0.5 text-sm text-ink-subtle">
                                            {certificate.recipient_name}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-ink-muted">No certificates issued yet.</p>
                        )}
                    </Card>

                    <Card as="section" aria-labelledby="activity-heading" className="p-5">
                        <div className="mb-4 flex items-baseline justify-between gap-3">
                            <h2 id="activity-heading" className="font-semibold text-ink">
                                Recent activity
                            </h2>
                            <Link
                                href="/admin/activity"
                                className="text-sm font-medium text-accent-ink underline-offset-2 hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {recentActivities.length > 0 ? (
                            <ul className="space-y-3">
                                {recentActivities.map((log) => (
                                    <li key={log.id} className="border-l-2 border-accent-line pl-3">
                                        <p className="text-sm text-ink">{log.description}</p>
                                        <p className="mt-0.5 text-sm text-ink-subtle">
                                            {new Date(log.created_at).toLocaleString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-ink-muted">No activity recorded yet.</p>
                        )}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
