import { Link } from '@inertiajs/react';
import { Award } from 'lucide-react';
import { ButtonLink, Card, EmptyState, PageHeader } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { Certificate } from '@/types';

interface Props {
    certificates: Certificate[];
}

export default function CertificatesIndex({ certificates }: Props) {
    return (
        <CaregiverLayout title="Certificates">
            <PageHeader
                title="Certificates"
                description="Every credential you have earned, with the ID employers use to verify it."
            />

            {certificates.length === 0 ? (
                <EmptyState
                    icon={<Award className="size-5" />}
                    title="No certificates yet"
                    description="Finish a program and pass its final assessment to earn your first credential."
                    action={<ButtonLink href="/caregiver/courses">Browse programs</ButtonLink>}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((certificate) => (
                        <Card
                            key={certificate.id}
                            as="article"
                            className="group relative flex flex-col p-5 transition hover:shadow-sm"
                        >
                            <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent-ink">
                                <Award className="size-5" />
                            </span>

                            <h2 className="mt-3 font-semibold tracking-tight text-ink">
                                <Link
                                    href={`/caregiver/certificates/${certificate.certificate_number}`}
                                    className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                >
                                    {certificate.title}
                                </Link>
                            </h2>

                            <dl className="mt-4 flex-1 space-y-2 border-t border-line pt-4 text-sm">
                                <div className="flex justify-between gap-3">
                                    <dt className="text-ink-muted">Issued</dt>
                                    <dd className="text-ink">{certificate.issued_at}</dd>
                                </div>
                                {certificate.grade_percentage != null ? (
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-ink-muted">Score</dt>
                                        <dd className="tabular font-medium text-ok">
                                            {certificate.grade_percentage}%
                                        </dd>
                                    </div>
                                ) : null}
                                <div className="flex justify-between gap-3">
                                    <dt className="text-ink-muted">ID</dt>
                                    <dd className="truncate font-mono text-ink">{certificate.certificate_number}</dd>
                                </div>
                            </dl>
                        </Card>
                    ))}
                </div>
            )}
        </CaregiverLayout>
    );
}
