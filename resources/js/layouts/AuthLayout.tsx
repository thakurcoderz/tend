import { Head, Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import FlashMessage from '@/components/FlashMessage';

interface Props {
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
}

export default function AuthLayout({ title, description, children, footer }: Props) {
    return (
        <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
            <Head title={`${title} | Tend`} />
            <FlashMessage />

            {/* Left — trust / clinical credibility. Hidden on mobile, visible on lg */}
            <div className="hidden flex-1 flex-col justify-between border-r border-line bg-surface px-10 py-10 lg:flex lg:max-w-[48%]">
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-control bg-accent text-white shadow-xs dark:text-[#04201d]">
                        <ShieldCheck className="size-5" />
                    </span>
                    <span className="leading-tight">
                        <span className="block text-[0.9375rem] font-semibold tracking-tight text-ink">Tend</span>
                        <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
                            Certification Academy
                        </span>
                    </span>
                </Link>

                <div className="mx-auto max-w-md py-10">
                    <p className="eyebrow">For caregivers, CNAs &amp; home health aides</p>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
                        A credential employers can verify in seconds.
                    </h2>
                    <p className="mt-4 leading-relaxed text-ink-muted">
                        Evidence-based training reviewed by practising clinicians. Self-paced, phone-friendly, and
                        free to start. Every certificate carries a verification ID at <span className="font-mono text-ink">/verify</span>.
                    </p>
                    <ul className="mt-8 space-y-3 text-sm text-ink-muted">
                        <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> Advisory-reviewed • Updated quarterly
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> 80% to pass • Clinical checklists included
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> No credit card to enrol
                        </li>
                    </ul>

                    <figure className="mt-10 rounded-card border border-line bg-surface-muted p-4">
                        <blockquote className="text-sm leading-relaxed text-ink">
                            “I refreshed my vitals and stroke recognition credential in a weekend. My supervisor verified it
                            online the same day.”
                        </blockquote>
                        <figcaption className="mt-3 flex items-center gap-2.5 text-xs">
                            <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-[0.6875rem] font-semibold text-accent-ink ring-1 ring-accent-line">
                                AO
                            </span>
                            <span>
                                <span className="block font-semibold text-ink">Adaeze Okonkwo</span>
                                <span className="block text-ink-subtle">Certified nursing assistant</span>
                            </span>
                        </figcaption>
                    </figure>
                </div>

                <p className="text-xs leading-relaxed text-ink-subtle">
                    Programs are reviewed by our Clinical Advisory Board of 12 clinicians and educators. Tend is not a
                    degree-granting institution.
                </p>
            </div>

            {/* Right — form */}
            <div className="flex flex-1 flex-col px-4 py-10 sm:px-6 lg:justify-center">
                <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                    <Link href="/" className="mx-auto flex items-center gap-2.5 lg:hidden">
                        <span className="flex size-9 items-center justify-center rounded-control bg-accent text-white dark:text-[#04201d]">
                            <ShieldCheck className="size-5" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-ink">Tend</span>
                    </Link>

                    <div className="mt-8 text-center lg:mt-0 lg:text-left">
                        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
                        <p className="mt-2 leading-relaxed text-ink-muted">{description}</p>
                    </div>

                    <div className="mt-8">{children}</div>

                    {footer ? <div className="mt-6 text-center text-sm text-ink-muted lg:text-left">{footer}</div> : null}

                    <p className="mt-8 text-center text-xs leading-relaxed text-ink-subtle lg:text-left">
                        By continuing you agree to our program guidelines. Credentials are verifiable at{' '}
                        <Link href="/verify" className="font-medium text-accent-ink underline underline-offset-2">
                            /verify
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
