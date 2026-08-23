import { Link, useForm } from '@inertiajs/react';
import type {FormEvent} from 'react';
import { Button, Card, Field, Input } from '@/components/ui';
import AuthLayout from '@/layouts/AuthLayout';

const DEMO_ACCOUNTS = [
    { label: 'Caregiver', email: 'caregiver@caregiver.test' },
    { label: 'Administrator', email: 'admin@caregiver.test' },
];

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    const fillDemo = (email: string) => setData({ email, password: 'password', remember: true });

    return (
        <AuthLayout
            title="Sign in"
            description="Continue your training and download your certificates."
            footer={
                <>
                    New here?{' '}
                    <Link href="/register" className="font-semibold text-accent-ink underline underline-offset-2">
                        Create an account
                    </Link>
                </>
            }
        >
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

                    <Field label="Password" htmlFor="password" error={errors.password} required>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            aria-invalid={Boolean(errors.password)}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                        />
                    </Field>

                    <label className="flex items-center gap-2.5 text-sm text-ink-muted">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(event) => setData('remember', event.target.checked)}
                            className="size-4 rounded border-line-strong text-accent focus:ring-accent"
                        />
                        Keep me signed in
                    </label>

                    <Button type="submit" size="lg" disabled={processing} className="w-full">
                        {processing ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </Card>

            <div className="mt-5 rounded-card border border-dashed border-line-strong p-4">
                <p className="text-sm font-medium text-ink">Demo accounts</p>
                <p className="mt-1 text-sm text-ink-muted">
                    For reviewing this project. Password is <code className="font-mono">password</code>.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {DEMO_ACCOUNTS.map((account) => (
                        <Button
                            key={account.email}
                            variant="secondary"
                            size="sm"
                            onClick={() => fillDemo(account.email)}
                        >
                            Use {account.label}
                        </Button>
                    ))}
                </div>
            </div>
        </AuthLayout>
    );
}
