import { ButtonLink, Section } from '@/components/ui';
import GuestLayout from '@/layouts/GuestLayout';

interface Step {
    number: string;
    title: string;
    description: string;
}

interface Props {
    steps: Step[];
}

export default function HowItWorks({ steps }: Props) {
    return (
        <GuestLayout title="How it works">
            <Section width="prose">
                <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    How certification works
                </h1>
                <p className="mt-3 text-lg text-ink-muted">
                    From creating an account to holding a credential an employer can check.
                </p>
            </Section>

            <Section className="border-y border-line bg-surface">
                <ol className="mx-auto max-w-3xl">
                    {steps.map((step, index) => (
                        <li
                            key={step.number}
                            className="relative flex gap-5 pb-10 last:pb-0"
                        >
                            {/* Connector rail, hidden on the final step */}
                            {index < steps.length - 1 ? (
                                <span
                                    aria-hidden="true"
                                    className="absolute bottom-2 left-[1.1875rem] top-10 w-px bg-line"
                                />
                            ) : null}

                            <span className="tabular relative z-10 flex size-9.5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-ink ring-1 ring-accent-line">
                                {step.number}
                            </span>

                            <div className="pt-1">
                                <h2 className="text-lg font-semibold tracking-tight text-ink">{step.title}</h2>
                                <p className="mt-2 max-w-[65ch] text-ink-muted">{step.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </Section>

            <Section width="prose" className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-ink">Ready when you are</h2>
                <p className="mx-auto mt-3 max-w-[52ch] text-ink-muted">
                    Create an account and start your first program today.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <ButtonLink href="/register" size="lg">
                        Create account
                    </ButtonLink>
                    <ButtonLink href="/programs" variant="secondary" size="lg">
                        Browse programs
                    </ButtonLink>
                </div>
            </Section>
        </GuestLayout>
    );
}
