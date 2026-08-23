import { Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Clock, Layers, ShieldCheck, Star } from 'lucide-react';
import { Badge, ButtonLink, Card, Section, SectionHeading } from '@/components/ui';
import GuestLayout from '@/layouts/GuestLayout';
import type { Course } from '@/types';

interface Props {
    featuredCourses: Course[];
    stats: {
        activeCaregivers: string;
        certificationsAwarded: string;
        courseHours: string;
        agencyPartners: string;
    };
}

const STEPS = [
    {
        title: 'Choose a program',
        body: 'Dementia care, home health clinicals, pediatric support, or emergency first aid.',
    },
    {
        title: 'Work through the modules',
        body: 'Evidence-based guides, safe transfer checklists, feeding guidelines, and vitals protocols.',
    },
    {
        title: 'Pass the assessment',
        body: 'Situational scenario exams. A score of 80% or higher demonstrates clinical competency.',
    },
    {
        title: 'Get your certificate',
        body: 'Download a certificate carrying a verification ID any employer can check online.',
    },
];

const TESTIMONIALS = [
    {
        quote: 'The validation therapy lessons changed how I support my client through evening sundowning.',
        name: 'Maya Lin',
        role: 'Senior home care aide',
    },
    {
        quote: 'I refreshed my vitals and stroke recognition credential in a weekend. My supervisor verified it online the same day.',
        name: 'Adaeze Okonkwo',
        role: 'Certified nursing assistant',
    },
    {
        quote: 'Telling sensory overload apart from behavioural escalation gave me calming tools that worked immediately.',
        name: 'Marcus Reyes',
        role: 'Pediatric support aide',
    },
];

export default function Home({ featuredCourses, stats }: Props) {
    const statItems = [
        { value: stats.activeCaregivers, label: 'Certified caregivers' },
        { value: stats.certificationsAwarded, label: 'Credentials issued' },
        { value: stats.courseHours, label: 'Hours of instruction' },
        { value: stats.agencyPartners, label: 'Partner agencies' },
    ];

    return (
        <GuestLayout title="Caregiver certification and verifiable credentials">
            {/* Hero: asymmetric split, copy left, real photography right */}
            <section className="border-b border-line bg-surface px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                            Get certified in the care you already give.
                        </h1>
                        <p className="mt-5 max-w-[52ch] text-lg text-ink-muted">
                            Accredited training in dementia care, clinical monitoring, and life safety, with a
                            credential employers can verify.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <ButtonLink href="/register" size="lg">
                                Create account
                                <ArrowRight className="size-4" />
                            </ButtonLink>
                            <ButtonLink href="/programs" variant="secondary" size="lg">
                                Browse programs
                            </ButtonLink>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <img
                            src="https://picsum.photos/seed/caregiver-home-visit-elderly/1200/900"
                            alt="A caregiver sitting with an older adult during a home visit"
                            width={1200}
                            height={900}
                            className="aspect-[4/3] w-full rounded-panel object-cover shadow-md"
                            fetchPriority="high"
                        />
                    </div>
                </div>
            </section>

            {/* Trust strip: lives under the hero, not inside it */}
            <section className="border-b border-line bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
                <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
                    {statItems.map((item) => (
                        <div key={item.label}>
                            <dt className="text-sm text-ink-muted">{item.label}</dt>
                            <dd className="tabular mt-1 text-3xl font-semibold tracking-tight text-ink">
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Catalog grid */}
            <Section>
                <SectionHeading
                    title="Certification programs"
                    description="Every program includes self-paced modules, clinical safety checklists, scenario-based assessment, and a verifiable credential."
                />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuredCourses.map((course) => (
                        <Card
                            key={course.id}
                            as="article"
                            className="group flex flex-col overflow-hidden transition hover:shadow-md"
                        >
                            <img
                                src={
                                    course.thumbnail ||
                                    `https://picsum.photos/seed/caregiver-course-${course.slug}/800/450`
                                }
                                alt=""
                                width={800}
                                height={450}
                                loading="lazy"
                                className="aspect-video w-full object-cover"
                            />

                            <div className="flex flex-1 flex-col p-5">
                                <Badge tone="accent" className="self-start">
                                    {course.category}
                                </Badge>

                                <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">
                                    <Link
                                        href="/programs"
                                        className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                    >
                                        {course.title}
                                    </Link>
                                </h3>

                                <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-muted">{course.summary}</p>

                                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-sm text-ink-subtle">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Layers className="size-4" />
                                        {course.modules_count ?? 0} modules
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="size-4" />
                                        {course.estimated_hours} hours
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-10">
                    <ButtonLink href="/programs" variant="secondary">
                        View all programs
                        <ArrowRight className="size-4" />
                    </ButtonLink>
                </div>
            </Section>

            {/* Process rail: different layout family from the card grid above */}
            <Section className="border-y border-line bg-surface">
                <SectionHeading
                    title="How certification works"
                    description="Four steps from signing up to a credential an employer can check."
                />

                <ol className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((step, index) => (
                        <li key={step.title} className="bg-surface p-6">
                            <span className="tabular text-sm font-semibold text-accent">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-2 font-semibold text-ink">{step.title}</h3>
                            <p className="mt-1.5 text-sm text-ink-muted">{step.body}</p>
                        </li>
                    ))}
                </ol>
            </Section>

            {/* Credential explainer: split reversed against the hero */}
            <Section>
                <div className="grid items-center gap-12 lg:grid-cols-12">
                    <div className="order-2 lg:order-1 lg:col-span-5">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 border-b border-line pb-4">
                                <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent-ink">
                                    <ShieldCheck className="size-5" />
                                </span>
                                <div>
                                    <p className="font-semibold text-ink">Tend</p>
                                    <p className="text-sm text-ink-subtle">Board of Clinical Certification</p>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-ink-subtle">Certificate of completion</p>
                            <p className="mt-1 text-lg font-semibold tracking-tight text-ink">
                                Dementia and Alzheimer&rsquo;s Care Specialist
                            </p>

                            <dl className="mt-5 flex items-center justify-between rounded-control bg-surface-muted px-3 py-2.5 text-sm">
                                <dt className="text-ink-muted">Verification ID</dt>
                                <dd className="font-mono font-semibold text-accent-ink">CERT-CADCS-2026-8942</dd>
                            </dl>
                        </Card>
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
                        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                            A credential that holds up to checking
                        </h2>
                        <p className="mt-3 max-w-[60ch] text-ink-muted">
                            Every certificate carries a verification ID. Agencies, supervisors, and families can
                            confirm who earned it, which program it covers, and when it was issued, without calling
                            anyone.
                        </p>
                        <div className="mt-7">
                            <ButtonLink href="/verify" variant="secondary">
                                <BadgeCheck className="size-4" />
                                Verify a certificate
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Testimonials */}
            <Section className="border-y border-line bg-surface">
                <SectionHeading title="What caregivers say" />

                <div className="grid gap-6 md:grid-cols-3">
                    {TESTIMONIALS.map((item) => (
                        <figure key={item.name} className="flex flex-col">
                            <div className="mb-3 flex gap-0.5 text-warn" aria-label="Rated 5 out of 5">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                                ))}
                            </div>
                            <blockquote className="flex-1 text-ink">
                                <p>&ldquo;{item.quote}&rdquo;</p>
                            </blockquote>
                            <figcaption className="mt-4 border-t border-line pt-4 text-sm">
                                <span className="font-semibold text-ink">{item.name}</span>
                                <span className="block text-ink-subtle">{item.role}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </Section>

            {/* Closing CTA */}
            <Section width="prose" className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    Start your certification today
                </h2>
                <p className="mx-auto mt-3 max-w-[52ch] text-ink-muted">
                    Create an account, pick a program, and work through it at your own pace.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <ButtonLink href="/register" size="lg">
                        Create account
                    </ButtonLink>
                    <ButtonLink href="/login" variant="secondary" size="lg">
                        Sign in
                    </ButtonLink>
                </div>
            </Section>
        </GuestLayout>
    );
}
