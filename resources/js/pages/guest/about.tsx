import { ButtonLink, Section } from '@/components/ui';
import GuestLayout from '@/layouts/GuestLayout';

interface Advisor {
    name: string;
    role: string;
    credentials: string;
    image: string;
}

interface Props {
    advisors: Advisor[];
}

const PRINCIPLES = [
    {
        title: 'Evidence over anecdote',
        body: 'Every module is built from current clinical guidance and reviewed before it goes out.',
    },
    {
        title: 'Written for the job',
        body: 'Content is designed to be read on a phone between visits, not at a desk.',
    },
    {
        title: 'Credentials that verify',
        body: 'Each certificate carries an ID anyone can check, so the credential means something.',
    },
];

export default function About({ advisors }: Props) {
    return (
        <GuestLayout title="About">
            <Section width="prose">
                <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    Standards set by working clinicians
                </h1>
                <p className="mt-3 text-lg text-ink-muted">
                    Tend trains and credentials the people who do the daily work of care:
                    personal care aides, nursing assistants, and family caregivers.
                </p>
            </Section>

            <Section className="border-y border-line bg-surface">
                <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
                    {PRINCIPLES.map((principle) => (
                        <div key={principle.title} className="bg-surface p-6">
                            <h2 className="font-semibold text-ink">{principle.title}</h2>
                            <p className="mt-2 text-sm text-ink-muted">{principle.body}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section>
                <div className="mb-10 max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                        Clinical advisory board
                    </h2>
                    <p className="mt-3 text-ink-muted">
                        Curriculum is reviewed and signed off by practising clinicians and educators.
                    </p>
                </div>

                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {advisors.map((advisor) => (
                        <li key={advisor.name} className="flex items-start gap-4">
                            <img
                                src={advisor.image}
                                alt=""
                                width={96}
                                height={96}
                                loading="lazy"
                                className="size-14 shrink-0 rounded-full object-cover ring-1 ring-line"
                            />
                            <div className="min-w-0">
                                <h3 className="font-semibold text-ink">{advisor.name}</h3>
                                <p className="text-sm text-accent-ink">{advisor.role}</p>
                                <p className="mt-1 text-sm text-ink-muted">{advisor.credentials}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section width="prose" className="border-t border-line bg-surface text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-ink">Work with us</h2>
                <p className="mx-auto mt-3 max-w-[52ch] text-ink-muted">
                    Training a team, or want to know which program fits a role? Get in touch.
                </p>
                <div className="mt-7">
                    <ButtonLink href="/contact" size="lg">
                        Contact us
                    </ButtonLink>
                </div>
            </Section>
        </GuestLayout>
    );
}
