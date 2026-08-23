import { Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Printer, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { Certificate } from '@/types';

interface Props {
    certificate: Certificate;
}

export default function CertificateShow({ certificate }: Props) {
    const issuedOn = new Date(certificate.issued_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <CaregiverLayout title={certificate.title}>
            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <Link
                        href="/caregiver/certificates"
                        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent-ink"
                    >
                        <ArrowLeft className="size-4" />
                        All certificates
                    </Link>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => window.print()}>
                            <Printer className="size-4" />
                            Print
                        </Button>
                        <a
                            href={`/verify/${certificate.certificate_number}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary"
                        >
                            <ExternalLink className="size-4" />
                            Public verification page
                        </a>
                    </div>
                </div>

                {/* The certificate itself: bordered document, prints cleanly */}
                <article className="rounded-panel border-2 border-accent-line bg-surface p-8 text-center shadow-sm sm:p-14 print:border-line print:shadow-none">
                    <div className="flex items-center justify-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-control bg-accent text-white dark:text-[#04201d]">
                            <ShieldCheck className="size-5" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-ink">Tend</span>
                    </div>

                    <p className="mt-10 text-sm uppercase tracking-[0.14em] text-ink-subtle">
                        Certificate of completion
                    </p>

                    <p className="mt-8 text-sm text-ink-muted">This certifies that</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                        {certificate.recipient_name}
                    </p>

                    <p className="mt-8 text-sm text-ink-muted">has successfully completed</p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-accent-ink sm:text-2xl">
                        {certificate.title}
                    </p>

                    {certificate.grade_percentage != null ? (
                        <p className="tabular mt-4 text-ink-muted">
                            Final score: {certificate.grade_percentage}%
                        </p>
                    ) : null}

                    <dl className="mt-12 grid gap-6 border-t border-line pt-8 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-ink-subtle">Verification ID</dt>
                            <dd className="mt-1 font-mono font-semibold text-ink">
                                {certificate.certificate_number}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-ink-subtle">Date issued</dt>
                            <dd className="mt-1 font-semibold text-ink">{issuedOn}</dd>
                        </div>
                    </dl>

                    <p className="mt-8 text-sm text-ink-subtle">
                        Verify this credential at /verify/{certificate.certificate_number}
                    </p>
                </article>
            </div>
        </CaregiverLayout>
    );
}
