import { Link, useForm } from '@inertiajs/react';
import type {FormEvent} from 'react';
import { Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import AuthLayout from '@/layouts/AuthLayout';

const SPECIALIZATIONS = [
    'Senior Home Care Aide',
    'Certified Nursing Assistant (CNA)',
    'Dementia Care Specialist',
    'Pediatric Special Needs Aide',
    'Hospice & Respite Caregiver',
    'Family Caregiver',
];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        specialization: SPECIALIZATIONS[0],
        bio: '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/register', { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <AuthLayout
            title="Create your account"
            description="Free access to every certification program and assessment."
            footer={
                <>
                    Already registered?{' '}
                    <Link href="/login" className="font-semibold text-accent-ink underline underline-offset-2">
                        Sign in
                    </Link>
                </>
            }
        >
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid gap-5 sm:grid-cols-2">
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

                        <Field label="Password" htmlFor="password" error={errors.password} required>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                aria-invalid={Boolean(errors.password)}
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                            />
                        </Field>

                        <Field
                            label="Confirm password"
                            htmlFor="password_confirmation"
                            error={errors.password_confirmation}
                            required
                        >
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                required
                                aria-invalid={Boolean(errors.password_confirmation)}
                                value={data.password_confirmation}
                                onChange={(event) => setData('password_confirmation', event.target.value)}
                            />
                        </Field>
                    </div>

                    <Field
                        label="About your work"
                        htmlFor="bio"
                        error={errors.bio}
                        hint="Optional. Shown on your certificates and profile."
                    >
                        <Textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            aria-invalid={Boolean(errors.bio)}
                            value={data.bio}
                            onChange={(event) => setData('bio', event.target.value)}
                        />
                    </Field>

                    <Button type="submit" size="lg" disabled={processing} className="w-full">
                        {processing ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </Card>
        </AuthLayout>
    );
}
