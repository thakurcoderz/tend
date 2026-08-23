import { useForm } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import type {FormEvent} from 'react';
import { Button, Card, Field, Input, PageHeader, Select, Textarea } from '@/components/ui';
import CaregiverLayout from '@/layouts/CaregiverLayout';
import type { User as UserType } from '@/types';

interface Props {
    user: UserType;
}

const SPECIALIZATIONS = [
    'Senior Home Care Aide',
    'Certified Nursing Assistant (CNA)',
    'Dementia Care Specialist',
    'Pediatric Special Needs Aide',
    'Hospice & Respite Caregiver',
    'Family Caregiver',
];

export default function ProfileEdit({ user }: Props) {
    const { data, setData, put, processing, errors, wasSuccessful, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || SPECIALIZATIONS[0],
        bio: user.bio || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        put('/caregiver/profile', {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <CaregiverLayout title="Profile">
            <PageHeader
                title="Profile and settings"
                description="Your name appears on every certificate you earn, so keep it accurate."
            />

            {wasSuccessful ? (
                <div
                    role="status"
                    className="mb-6 flex items-start gap-3 rounded-card border border-ok-line bg-ok-soft p-4"
                >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ok" />
                    <p className="text-sm text-ink">Your profile has been updated.</p>
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" noValidate>
                <Card as="section" aria-labelledby="details-heading" className="p-6">
                    <h2 id="details-heading" className="font-semibold text-ink">
                        Personal details
                    </h2>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field label="Full name" htmlFor="name" error={errors.name} required>
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

                        <Field label="Phone" htmlFor="phone" error={errors.phone} hint="Optional">
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                aria-invalid={Boolean(errors.phone)}
                                value={data.phone}
                                onChange={(event) => setData('phone', event.target.value)}
                            />
                        </Field>

                        <Field label="Current role" htmlFor="specialization" error={errors.specialization}>
                            <Select
                                id="specialization"
                                name="specialization"
                                value={data.specialization}
                                onChange={(event) => setData('specialization', event.target.value)}
                            >
                                {SPECIALIZATIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    </div>

                    <Field
                        className="mt-5"
                        label="About your work"
                        htmlFor="bio"
                        error={errors.bio}
                        hint="Optional. A short summary of your caregiving experience."
                    >
                        <Textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            aria-invalid={Boolean(errors.bio)}
                            value={data.bio}
                            onChange={(event) => setData('bio', event.target.value)}
                        />
                    </Field>
                </Card>

                <Card as="section" aria-labelledby="password-heading" className="p-6">
                    <h2 id="password-heading" className="font-semibold text-ink">
                        Change password
                    </h2>
                    <p className="mt-1 text-sm text-ink-muted">Leave both fields blank to keep your current password.</p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field label="New password" htmlFor="password" error={errors.password}>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.password)}
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                            />
                        </Field>

                        <Field
                            label="Confirm new password"
                            htmlFor="password_confirmation"
                            error={errors.password_confirmation}
                        >
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.password_confirmation)}
                                value={data.password_confirmation}
                                onChange={(event) => setData('password_confirmation', event.target.value)}
                            />
                        </Field>
                    </div>
                </Card>

                <Button type="submit" size="lg" disabled={processing}>
                    {processing ? 'Saving...' : 'Save changes'}
                </Button>
            </form>
        </CaregiverLayout>
    );
}
