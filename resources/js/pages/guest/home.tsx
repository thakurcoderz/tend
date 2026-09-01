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
            {/* Hero: asymmetric split, copy left, clinical photography right */}
            <section className="border-b border-line bg-surface px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <p className="eyebrow">Trusted by home health agencies nationwide</p>
                        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-[2.75rem] lg:text-5xl">
                            Get certified in the care you already give.
                        </h1>
                        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
                            Accredited training in dementia care, clinical monitoring, and life safety — with a
                            credential employers can verify in seconds.
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
                        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
                            <span className="inline-flex items-center gap-1.5">
                                <BadgeCheck className="size-3.5 text-ok" /> No credit card to start
                            </span>
                            <span className="hidden size-1 rounded-full bg-line sm:inline-block" aria-hidden="true" />
                            <span>80% to pass</span>
                            <span className="hidden size-1 rounded-full bg-line sm:inline-block" aria-hidden="true" />
                            <span>Verified at /verify</span>
                        </p>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="relative overflow-hidden rounded-panel border border-line bg-surface-muted shadow-md">
                            <img
                                src="https://picsum.photos/seed/caregiver-home-visit-elderly/1200/900"
                                alt="A caregiver sitting with an older adult during a home visit"
                                width={1200}
                                height={900}
                                className="aspect-[4/3] w-full object-cover"
                                fetchPriority="high"
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5"
                            />
                            {/* Floating credibility badge — looks native, not a stock overlay */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-2.5 rounded-card border border-line bg-surface/95 px-3 py-2 shadow-sm backdrop-blur sm:bottom-4 sm:left-4">
                                <span className="flex size-8 items-center justify-center rounded-full bg-ok-soft text-ok ring-1 ring-ok-line">
                                    <ShieldCheck className="size-4" />
                                </span>
                                <span className="leading-tight">
                                    <span className="block text-xs font-semibold text-ink">Advisory reviewed</span>
                                    <span className="block text-xs text-ink-subtle">12 clinicians • Updated quarterly</span>
                                </span>
                            </div>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
                            15-hour programs. Self-paced. Work through on a phone between visits.
                        </p>
                    </div>
                </div>
            </section>

            {/* Trust strip: lives under the hero, not inside it */}
            <section className="border-b border-line bg-surface-muted px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
                    {statItems.map((item) => (
                        <div key={item.label} className="border-l-2 border-accent-line pl-4 first:border-accent">
                            <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">
                                {item.label}
                            </dt>
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
                    eyebrow="Evidence-based curriculum"
                    title="Certification programs"
                    description="Every program includes self-paced modules, clinical safety checklists, scenario-based assessment, and a verifiable credential."
                />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuredCourses.map((course) => (
                        <Card
                            key={course.id}
                            as="article"
                            className="group card-hover flex flex-col overflow-hidden"
                        >
                            <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
                                <img
                                    src={
                                        course.thumbnail ||
                                        `https://picsum.photos/seed/caregiver-course-${course.slug}/800/450`
                                    }
                                    alt=""
                                    width={800}
                                    height={450}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
                                <div className="absolute bottom-2.5 left-3 flex gap-1.5">
                                    <span className="rounded-full bg-surface/95 px-2 py-0.5 text-xs font-semibold text-ink shadow-sm ring-1 ring-black/5">
                                        {course.level}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <Badge tone="accent" className="self-start">
                                    {course.category}
                                </Badge>

                                <h3 className="mt-3 text-lg font-semibold leading-tight tracking-tight text-ink">
                                    <Link
                                        href="/programs"
                                        className="after:absolute after:inset-0 group-hover:text-accent-ink"
                                    >
                                        {course.title}
                                    </Link>
                                </h3>

                                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">{course.summary}</p>

                                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-xs font-medium uppercase tracking-[0.04em] text-ink-subtle">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Layers className="size-3.5" />
                                        {course.modules_count ?? 0} modules
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="size-3.5" />
                                        {course.estimated_hours} hrs
                                    </span>
                                    <span className="ml-auto inline-flex items-center gap-1 text-accent-ink">
                                        Enrol free <ArrowRight className="size-3" />
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <ButtonLink href="/programs" variant="secondary">
                        View all programs
                        <ArrowRight className="size-4" />
                    </ButtonLink>
                    <span className="text-sm text-ink-subtle">12 programs • Enrol free • Verify at /verify</span>
                </div>
            </Section>

            {/* Process rail: different layout family from the card grid above */}
            <Section className="border-y border-line bg-surface">
                <SectionHeading
                    eyebrow="From sign-up to verified credential"
                    title="How certification works"
                    description="Four steps from signing up to a credential an employer can check — no paperwork."
                />

                <ol className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((step, index) => (
                        <li key={step.title} className="bg-surface p-6">
                            <span className="tabular inline-flex size-7 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-ink ring-1 ring-accent-line">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-3 font-semibold leading-tight text-ink">{step.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                        </li>
                    ))}
                </ol>
            </Section>

            {/* Credential explainer: split reversed against the hero */}
            <Section>
                <div className="grid items-center gap-12 lg:grid-cols-12">
                    <div className="order-2 lg:order-1 lg:col-span-5">
                        <div className="cert-paper p-6 sm:p-7">
                            <div className="relative">
                                <div className="flex items-center gap-3 border-b border-line pb-4">
                                    <span className="flex size-10 items-center justify-center rounded-control bg-accent text-white shadow-xs dark:text-[#04201d]">
                                        <ShieldCheck className="size-5" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold tracking-tight text-ink">Tend</p>
                                        <p className="text-xs font-medium uppercase tracking-[0.06em] text-ink-subtle">
                                            Board of Clinical Certification
                                        </p>
                                    </div>
                                    <span className="ml-auto hidden rounded-full border border-ok-line bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok sm:inline-flex">
                                        Valid • Verifiable
                                    </span>
                                </div>

                                <p className="mt-5 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                                    Certificate of completion
                                </p>
                                <p className="mt-2 text-center text-lg font-semibold leading-tight tracking-tight text-ink">
                                    Dementia and Alzheimer&rsquo;s Care Specialist
                                </p>
                                <p className="mt-1 text-center text-sm text-ink-subtle">Awarded to — completed 2026</p>

                                <dl className="mt-6 flex items-center justify-between rounded-control bg-surface-muted px-3 py-2.5 text-sm ring-1 ring-line">
                                    <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">
                                        Verification ID
                                    </dt>
                                    <dd className="font-mono text-xs font-semibold tracking-tight text-accent-ink sm:text-sm">
                                        CERT-CADCS-2026-8942
                                    </dd>
                                </dl>
                                <p className="mt-3 text-center text-xs text-ink-faint">Verify at tend.care/verify</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
                        <p className="eyebrow">Verifiable in 10 seconds</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                            A credential that holds up to checking
                        </h2>
                        <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-muted">
                            Every certificate carries a verification ID and hash. Agencies, supervisors, and families
                            can confirm who earned it, which program it covers, and when it was issued — without a
                            phone call.
                        </p>
                        <ul className="mt-5 space-y-2 text-sm text-ink-muted">
                            <li className="flex gap-2">
                                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-ok" /> Public page at /verify/
                                <span className="font-mono text-ink">CERT-…</span>
                            </li>
                            <li className="flex gap-2">
                                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-ok" /> Shows program, hours, score &amp; issue date
                            </li>
                            <li className="flex gap-2">
                                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-ok" /> No login required for verifiers
                            </li>
                        </ul>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <ButtonLink href="/verify" variant="secondary">
                                <BadgeCheck className="size-4" />
                                Verify a certificate
                            </ButtonLink>
                            <ButtonLink href="/programs" variant="ghost">
                                Browse programs <ArrowRight className="size-4" />
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Testimonials */}
            <Section className="border-y border-line bg-surface">
                <SectionHeading eyebrow="Field-tested content" title="What caregivers say" />

                <div className="grid gap-6 md:grid-cols-3">
                    {TESTIMONIALS.map((item) => (
                        <Card key={item.name} as="figure" className="flex flex-col p-6">
                            <div className="mb-3 flex gap-0.5 text-warn" aria-label="Rated 5 out of 5">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                                ))}
                            </div>
                            <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-ink">
                                <p>&ldquo;{item.quote}&rdquo;</p>
                            </blockquote>
                            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4 text-sm">
                                <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink ring-1 ring-accent-line">
                                    {item.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </span>
                                <span>
                                    <span className="block font-semibold leading-none text-ink">{item.name}</span>
                                    <span className="block text-xs text-ink-subtle">{item.role}</span>
                                </span>
                            </figcaption>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* Closing CTA */}
            <Section width="prose" className="text-center">
                <div className="mx-auto max-w-2xl rounded-panel border border-line bg-surface p-8 shadow-sm sm:p-10">
                    <p className="eyebrow justify-center before:hidden">Start today — finish between visits</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                        Start your certification today
                    </h2>
                    <p className="mx-auto mt-3 max-w-[52ch] leading-relaxed text-ink-muted">
                        Create an account, pick a program, and work through it at your own pace. No credit card
                        required to enrol.
                    </p>
                    <ul className="mx-auto mt-6 flex max-w-fit flex-col gap-2 text-left text-sm text-ink-muted sm:flex-row sm:gap-6">
                        <li className="inline-flex items-center gap-1.5">
                            <BadgeCheck className="size-4 text-ok" /> Self-paced
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                            <BadgeCheck className="size-4 text-ok" /> Verifiable credential
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                            <BadgeCheck className="size-4 text-ok" /> Phone-friendly
                        </li>
                    </ul>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <ButtonLink href="/register" size="lg">
                            Create account
                        </ButtonLink>
                        <ButtonLink href="/login" variant="secondary" size="lg">
                            Sign in
                        </ButtonLink>
                    </div>
                </div>
            </Section>
        </GuestLayout>
    );
}
