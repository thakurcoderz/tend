import { Link } from '@inertiajs/react';
import { Award, ArrowLeft, BookOpen, CheckCircle2, Mail, Phone } from 'lucide-react';
import { Avatar, Badge, Card, PageHeader, Stat } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type {
    ActivityLog,
    Certificate,
    Enrollment,
    LessonProgress,
    QuizAttempt,
    User as UserType,
} from '@/types';

interface Props {
    caregiver: UserType & {
        enrollments: Enrollment[];
        certificates: Certificate[];
        quiz_attempts: QuizAttempt[];
        lesson_progress: LessonProgress[];
        activity_logs: ActivityLog[];
    };
}

export default function CaregiverShow({ caregiver }: Props) {
    return (
        <AdminLayout title={caregiver.name}>
            <PageHeader
                breadcrumb={
                    <Link
                        href="/admin/caregivers"
                        className="inline-flex items-center gap-1.5 hover:text-accent-ink"
                    >
                        <ArrowLeft className="size-4" />
                        Caregivers
                    </Link>
                }
                title={caregiver.name}
                description={caregiver.specialization ?? undefined}
            />

            <Card className="mb-6 p-5">
                <div className="flex flex-wrap items-center gap-5">
                    <Avatar name={caregiver.name} src={caregiver.avatar} className="size-14" />

                    <dl className="flex flex-wrap gap-x-8 gap-y-3">
                        <div>
                            <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                                <Mail className="size-4" />
                                Email
                            </dt>
                            <dd className="mt-0.5 text-ink">{caregiver.email}</dd>
                        </div>
                        {caregiver.phone ? (
                            <div>
                                <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                                    <Phone className="size-4" />
                                    Phone
                                </dt>
                                <dd className="mt-0.5 text-ink">{caregiver.phone}</dd>
                            </div>
                        ) : null}
                        <div>
                            <dt className="text-sm text-ink-muted">Joined</dt>
                            <dd className="mt-0.5 text-ink">
                                {new Date(caregiver.created_at).toLocaleDateString(undefined, {
                                    dateStyle: 'medium',
                                })}
                            </dd>
                        </div>
                    </dl>
                </div>

                {caregiver.bio ? <p className="mt-5 max-w-[70ch] text-ink-muted">{caregiver.bio}</p> : null}
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Enrolments" value={caregiver.enrollments.length} icon={<BookOpen className="size-5" />} />
                <Stat
                    label="Lessons completed"
                    value={caregiver.lesson_progress.length}
                    icon={<CheckCircle2 className="size-5" />}
                />
                <Stat label="Assessments taken" value={caregiver.quiz_attempts.length} />
                <Stat
                    label="Certificates"
                    value={caregiver.certificates.length}
                    icon={<Award className="size-5" />}
                />
            </div>

            <section aria-labelledby="enrolments-heading" className="mt-8">
                <h2 id="enrolments-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                    Enrolments
                </h2>

                {caregiver.enrollments.length > 0 ? (
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Program</th>
                                    <th scope="col">Progress</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {caregiver.enrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td className="font-medium">{enrollment.course?.title ?? 'Program'}</td>
                                        <td className="tabular">{enrollment.progress_percentage}%</td>
                                        <td>
                                            <Badge tone={enrollment.status === 'completed' ? 'ok' : 'info'}>
                                                {enrollment.status === 'completed' ? 'Completed' : 'In progress'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Card className="p-6">
                        <p className="text-ink-muted">This caregiver has not enrolled in any programs yet.</p>
                    </Card>
                )}
            </section>

            <section aria-labelledby="certs-heading" className="mt-8">
                <h2 id="certs-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                    Certificates
                </h2>

                {caregiver.certificates.length > 0 ? (
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Certificate</th>
                                    <th scope="col">Verification ID</th>
                                    <th scope="col">Issued</th>
                                </tr>
                            </thead>
                            <tbody>
                                {caregiver.certificates.map((certificate) => (
                                    <tr key={certificate.id}>
                                        <td className="font-medium">{certificate.title}</td>
                                        <td className="whitespace-nowrap font-mono text-ink-muted">
                                            {certificate.certificate_number}
                                        </td>
                                        <td className="whitespace-nowrap text-ink-muted">{certificate.issued_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Card className="p-6">
                        <p className="text-ink-muted">No certificates issued to this caregiver.</p>
                    </Card>
                )}
            </section>

            <section aria-labelledby="activity-heading" className="mt-8">
                <h2 id="activity-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                    Recent activity
                </h2>

                {caregiver.activity_logs.length > 0 ? (
                    <Card className="p-5">
                        <ul className="space-y-3">
                            {caregiver.activity_logs.map((log) => (
                                <li key={log.id} className="border-l-2 border-accent-line pl-3">
                                    <p className="text-sm text-ink">{log.description}</p>
                                    <p className="mt-0.5 text-sm text-ink-subtle">
                                        {new Date(log.created_at).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ) : (
                    <Card className="p-6">
                        <p className="text-ink-muted">No activity recorded.</p>
                    </Card>
                )}
            </section>
        </AdminLayout>
    );
}
