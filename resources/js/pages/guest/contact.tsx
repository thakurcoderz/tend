import { useForm } from '@inertiajs/react';
import { CheckCircle2, ChevronDown, Mail, Phone } from 'lucide-react';
import { useState  } from 'react';
import type {FormEvent} from 'react';
import { Button, Card, Field, Input, Section, Textarea } from '@/components/ui';
import GuestLayout from '@/layouts/GuestLayout';
import { cn } from '@/lib/utils';

interface FAQ {
    question: string;
    answer: string;
}

interface Props {
    faqs: FAQ[];
}

export default function Contact({ faqs }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/contact', { onSuccess: () => reset() });
    };

    return (
        <GuestLayout title="Contact and support">
            <Section>
                <div className="max-w-2xl">
                    <p className="eyebrow">We reply within one working day</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Contact us</h1>
                    <p className="mt-3 leading-relaxed text-ink-muted">
                        Questions about a program, a credential, or training a team? Send us a message — a real
                        person on our faculty team replies.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <Card className="p-6">
                            {wasSuccessful ? (
                                <div
                                    role="status"
                                    className="mb-6 flex items-start gap-3 rounded-control border border-ok-line bg-ok-soft p-4"
                                >
                                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ok" />
                                    <p className="text-sm text-ink">
                                        Thanks, your message is with our team. We reply within one working day.
                                    </p>
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field label="Your name" htmlFor="name" error={errors.name} required>
                                        <Input
                                            id="name"
                                            name="name"
                                            autoComplete="name"
                                            required
                                            aria-invalid={Boolean(errors.name)}
                                            value={data.name}
                                            onChange={(event) => setData('name', event.target.value)}
                                        />
                                    </Field>

                                    <Field label="Email address" htmlFor="email" error={errors.email} required>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            aria-invalid={Boolean(errors.email)}
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                        />
                                    </Field>
                                </div>

                                <Field label="Subject" htmlFor="subject" error={errors.subject} required>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        required
                                        aria-invalid={Boolean(errors.subject)}
                                        value={data.subject}
                                        onChange={(event) => setData('subject', event.target.value)}
                                    />
                                </Field>

                                <Field label="Message" htmlFor="message" error={errors.message} required>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        required
                                        aria-invalid={Boolean(errors.message)}
                                        value={data.message}
                                        onChange={(event) => setData('message', event.target.value)}
                                    />
                                </Field>

                                <Button type="submit" size="lg" disabled={processing}>
                                    {processing ? 'Sending...' : 'Send message'}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    <div className="lg:col-span-5">
                        <Card className="p-6">
                            <h2 className="font-semibold text-ink">Reach us directly</h2>
                            <dl className="mt-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 size-4.5 shrink-0 text-accent" />
                                    <div>
                                        <dt className="text-sm text-ink-muted">Email</dt>
                                        <dd>
                                            <a
                                                href="mailto:faculty@tend.care"
                                                className="font-medium text-ink underline-offset-2 hover:text-accent-ink hover:underline"
                                            >
                                                faculty@tend.care
                                            </a>
                                        </dd>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 size-4.5 shrink-0 text-accent" />
                                    <div>
                                        <dt className="text-sm text-ink-muted">Phone</dt>
                                        <dd>
                                            <a
                                                href="tel:+18005552273"
                                                className="font-medium text-ink underline-offset-2 hover:text-accent-ink hover:underline"
                                            >
                                                +1 (800) 555-2273
                                            </a>
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section width="prose" className="border-t border-line bg-surface">
                <h2 className="text-2xl font-semibold tracking-tight text-ink">Common questions</h2>

                <dl className="mt-8 divide-y divide-line border-y border-line">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={faq.question}>
                                <dt>
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-answer-${index}`}
                                        className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-ink"
                                    >
                                        {faq.question}
                                        <ChevronDown
                                            className={cn(
                                                'size-4.5 shrink-0 text-ink-subtle transition-transform',
                                                isOpen && 'rotate-180',
                                            )}
                                        />
                                    </button>
                                </dt>
                                {isOpen ? (
                                    <dd id={`faq-answer-${index}`} className="pb-5 text-ink-muted">
                                        {faq.answer}
                                    </dd>
                                ) : null}
                            </div>
                        );
                    })}
                </dl>
            </Section>
        </GuestLayout>
    );
}
