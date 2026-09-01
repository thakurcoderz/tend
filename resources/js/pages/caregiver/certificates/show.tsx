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
                <article className="cert-paper p-8 text-center shadow-sm sm:p-12 print:shadow-none">
                    <div className="relative">
                        <div className="flex items-center justify-center gap-2.5">
                            <span className="flex size-9 items-center justify-center rounded-control bg-accent text-white shadow-xs dark:text-[#04201d]">
                                <ShieldCheck className="size-5" />
                            </span>
                            <span className="text-lg font-semibold tracking-tight text-ink">Tend</span>
                            <span className="hidden text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle sm:inline">
                                — Board of Clinical Certification
                            </span>
                        </div>

                        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
                            Certificate of completion
                        </p>

                        <p className="mt-8 text-sm text-ink-muted">This certifies that</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                            {certificate.recipient_name}
                        </p>

                        <p className="mt-8 text-sm text-ink-muted">has successfully completed the program</p>
                        <p className="mt-2 text-xl font-semibold tracking-tight text-accent-ink sm:text-2xl">
                            {certificate.title}
                        </p>

                        {certificate.grade_percentage != null ? (
                            <p className="tabular mt-4 inline-flex items-center gap-2 rounded-full border border-ok-line bg-ok-soft px-3 py-1 text-sm font-medium text-ok">
                                Final score: {certificate.grade_percentage}% • Pass mark 80%
                            </p>
                        ) : null}

                        {/* Seal + signatures */}
                        <div className="mt-10 flex flex-col items-center gap-6 border-t border-line pt-8 sm:flex-row sm:justify-between sm:text-left">
                            <div className="flex items-center gap-3">
                                <span className="flex size-14 items-center justify-center rounded-full border-2 border-accent-line bg-accent-soft text-accent-ink">
                                    <ShieldCheck className="size-6" />
                                </span>
                                <span className="text-left leading-tight">
                                    <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">Official seal</span>
                                    <span className="block text-sm font-medium text-ink">Tend Certification Academy</span>
                                </span>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                                    Verification
                                </p>
                                <p className="mt-1 font-mono text-sm font-semibold tracking-tight text-ink">
                                    {certificate.certificate_number}
                                </p>
                                <p className="mt-0.5 text-xs text-ink-subtle">Verify at /verify/{certificate.certificate_number}</p>
                            </div>
                        </div>

                        <dl className="mt-8 grid gap-6 border-t border-line/60 pt-6 text-sm sm:grid-cols-3">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">Date issued</dt>
                                <dd className="mt-1 font-semibold text-ink">{issuedOn}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">Verification ID</dt>
                                <dd className="mt-1 font-mono text-xs font-semibold text-ink sm:text-sm">
                                    {certificate.certificate_number}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">Credential</dt>
                                <dd className="mt-1 font-medium text-ink">Verifiable • Non-expiring</dd>
                            </div>
                        </dl>

                        <div className="mt-8 flex justify-center gap-8 border-t border-line pt-6">
                            <div className="text-center">
                                <div className="mx-auto h-px w-24 bg-ink/20" aria-hidden="true" />
                                <p className="mt-2 text-xs font-medium text-ink">Clinical Director</p>
                                <p className="text-xs text-ink-subtle">Tend Advisory Board</p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto h-px w-24 bg-ink/20" aria-hidden="true" />
                                <p className="mt-2 text-xs font-medium text-ink">Program Lead</p>
                                <p className="text-xs text-ink-subtle">Certification Academy</p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </CaregiverLayout>
    );
}
