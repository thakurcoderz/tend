import { router } from '@inertiajs/react';
import { Award, Building2, Calendar, Search, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { useState  } from 'react';
import type {FormEvent} from 'react';
import { Badge, Button, Card, Input, Section } from '@/components/ui';
import GuestLayout from '@/layouts/GuestLayout';

interface CertificateData {
    id: number;
    certificate_number: string;
    title: string;
    recipient_name: string;
    grade_percentage?: number | null;
    verification_hash: string;
    issued_at: string;
    expires_at?: string | null;
    course?: {
        id: number;
        title: string;
        badge_title?: string;
        category: string;
        estimated_hours: number;
    } | null;
    user: {
        name: string;
        avatar?: string | null;
        specialization?: string | null;
    };
}

interface Props {
    /** Null until the visitor has actually looked something up. */
    code: string | null;
    certificate: CertificateData | null;
    isValid: boolean;
}

export default function Verify({ code, certificate, isValid }: Props) {
    const [query, setQuery] = useState(code ?? '');

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = query.trim();

        if (trimmed) {
            router.get(`/verify/${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <GuestLayout title="Verify a certificate">
            <Section width="prose">
                <h1 className="text-3xl font-semibold tracking-tight text-ink">Verify a certificate</h1>
                <p className="mt-3 text-ink-muted">
                    Enter the verification ID printed on the certificate to confirm it was issued by
                    Tend.
                </p>

                <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-2 sm:flex-row">
                    <div className="flex-1">
                        <label htmlFor="code" className="sr-only">
                            Verification ID
                        </label>
                        <Input
                            id="code"
                            name="code"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="CERT-CADCS-2026-8942"
                            className="font-mono"
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>
                    <Button type="submit" size="lg" disabled={!query.trim()}>
                        <Search className="size-4" />
                        Verify
                    </Button>
                </form>

                {/* Three states: nothing looked up yet, found, not found. */}
                {code === null ? (
                    <p className="mt-6 text-sm text-ink-subtle">
                        The verification ID appears at the bottom of every certificate we issue.
                    </p>
                ) : isValid && certificate ? (
                    <Card className="mt-8 overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-ok-line bg-ok-soft px-6 py-4">
                            <ShieldCheck className="size-5 shrink-0 text-ok" />
                            <div>
                                <p className="font-semibold text-ok">Valid certificate</p>
                                <p className="text-sm text-ink-muted">
                                    Issued by Tend and currently in good standing.
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-ink-subtle">Certificate of completion</p>
                            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
                                {certificate.title}
                            </h2>
                            {certificate.course ? (
                                <Badge tone="accent" className="mt-3">
                                    {certificate.course.category}
                                </Badge>
                            ) : null}

                            <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-2">
                                <div>
                                    <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                                        <User className="size-4" />
                                        Awarded to
                                    </dt>
                                    <dd className="mt-1 font-medium text-ink">{certificate.recipient_name}</dd>
                                    {certificate.user.specialization ? (
                                        <dd className="text-sm text-ink-subtle">
                                            {certificate.user.specialization}
                                        </dd>
                                    ) : null}
                                </div>

                                <div>
                                    <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                                        <Calendar className="size-4" />
                                        Issued
                                    </dt>
                                    <dd className="mt-1 font-medium text-ink">{certificate.issued_at}</dd>
                                    {certificate.expires_at ? (
                                        <dd className="text-sm text-ink-subtle">
                                            Expires {certificate.expires_at}
                                        </dd>
                                    ) : null}
                                </div>

                                {certificate.course ? (
                                    <div>
                                        <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                                            <Building2 className="size-4" />
                                            Program
                                        </dt>
                                        <dd className="mt-1 font-medium text-ink">{certificate.course.title}</dd>
                                        <dd className="text-sm text-ink-subtle">
                                            {certificate.course.estimated_hours} hours of instruction
                                        </dd>
                                    </div>
                                ) : null}

                                {certificate.grade_percentage != null ? (
                                    <div>
                                        <dt className="flex items-center gap-1.5 text-sm text-ink-muted">
                                            <Award className="size-4" />
                                            Final score
                                        </dt>
                                        <dd className="tabular mt-1 font-medium text-ink">
                                            {certificate.grade_percentage}%
                                        </dd>
                                    </div>
                                ) : null}
                            </dl>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-control bg-surface-muted px-3 py-2.5 text-sm">
                                <span className="text-ink-muted">Verification ID</span>
                                <span className="font-mono font-semibold text-accent-ink">
                                    {certificate.certificate_number}
                                </span>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="mt-8 p-6">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-danger" />
                            <div>
                                <p className="font-semibold text-ink">No certificate found</p>
                                <p className="mt-1 text-ink-muted">
                                    Nothing matches{' '}
                                    <span className="font-mono font-medium text-ink">{code}</span>. Check the ID for
                                    typos, or ask the certificate holder to resend it.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </Section>
        </GuestLayout>
    );
}
