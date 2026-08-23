import { Award, BookOpen, CheckCircle2, Printer } from 'lucide-react';
import { Badge, Button, Card, PageHeader, Stat } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { Certificate, Enrollment, LessonProgress, QuizAttempt, User } from '@/types';

interface Props {
    user: User;
    enrollments: Enrollment[];
    lessonProgress: LessonProgress[];
    quizAttempts: QuizAttempt[];
    certificates: Certificate[];
}

export default function TranscriptIndex({
    user,
    enrollments,
    lessonProgress,
    quizAttempts,
    certificates,
}: Props) {
    return (
        <CaregiverLayout title="Transcript">
            <PageHeader
                title="Academic transcript"
                description={`Complete training record for ${user.name}.`}
                actions={
                    <Button variant="secondary" onClick={() => window.print()} className="print:hidden">
                        <Printer className="size-4" />
                        Print
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Programs enrolled" value={enrollments.length} icon={<BookOpen className="size-5" />} />
                <Stat
                    label="Lessons completed"
                    value={lessonProgress.length}
                    icon={<CheckCircle2 className="size-5" />}
                />
                <Stat label="Certificates earned" value={certificates.length} icon={<Award className="size-5" />} />
            </div>

            <section aria-labelledby="programs-heading" className="mt-8">
                <h2 id="programs-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                    Programs
                </h2>

                {enrollments.length > 0 ? (
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Program</th>
                                    <th scope="col">Enrolled</th>
                                    <th scope="col">Progress</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td className="font-medium">{enrollment.course?.title ?? 'Program'}</td>
                                        <td className="tabular whitespace-nowrap text-ink-muted">
                                            {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                        </td>
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
                        <p className="text-ink-muted">No programs on record yet.</p>
                    </Card>
                )}
            </section>

            <section aria-labelledby="certs-heading" className="mt-8">
                <h2 id="certs-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                    Certificates
                </h2>

                {certificates.length > 0 ? (
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Certificate</th>
                                    <th scope="col">Verification ID</th>
                                    <th scope="col">Issued</th>
                                    <th scope="col">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificates.map((certificate) => (
                                    <tr key={certificate.id}>
                                        <td className="font-medium">{certificate.title}</td>
                                        <td className="whitespace-nowrap font-mono text-ink-muted">
                                            {certificate.certificate_number}
                                        </td>
                                        <td className="whitespace-nowrap text-ink-muted">{certificate.issued_at}</td>
                                        <td className="tabular">
                                            {certificate.grade_percentage != null
                                                ? `${certificate.grade_percentage}%`
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Card className="p-6">
                        <p className="text-ink-muted">No certificates issued yet.</p>
                    </Card>
                )}
            </section>

            <section aria-labelledby="assessments-heading" className="mt-8">
                <h2 id="assessments-heading" className="mb-4 text-lg font-semibold tracking-tight text-ink">
                    Assessment attempts
                </h2>

                {quizAttempts.length > 0 ? (
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Assessment</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Score</th>
                                    <th scope="col">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizAttempts.map((attempt) => (
                                    <tr key={attempt.id}>
                                        <td className="font-medium">{attempt.quiz?.title ?? 'Assessment'}</td>
                                        <td className="whitespace-nowrap text-ink-muted">
                                            {new Date(attempt.completed_at).toLocaleDateString()}
                                        </td>
                                        <td className="tabular">
                                            {attempt.percentage}%
                                            <span className="ml-1.5 text-ink-subtle">
                                                ({attempt.score}/{attempt.max_score})
                                            </span>
                                        </td>
                                        <td>
                                            <Badge tone={attempt.passed ? 'ok' : 'danger'}>
                                                {attempt.passed ? 'Passed' : 'Not passed'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Card className="p-6">
                        <p className="text-ink-muted">No assessment attempts on record.</p>
                    </Card>
                )}
            </section>
        </CaregiverLayout>
    );
}
