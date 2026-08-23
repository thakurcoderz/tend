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
        <div className="flex min-h-screen flex-col bg-canvas px-4 py-10 sm:px-6">
            <Head title={`${title} | Tend`} />
            <FlashMessage />

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                <Link href="/" className="mx-auto flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-control bg-accent text-white dark:text-[#04201d]">
                        <ShieldCheck className="size-5" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-ink">Tend</span>
                </Link>

                <div className="mt-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
                    <p className="mt-2 text-ink-muted">{description}</p>
                </div>

                <div className="mt-8">{children}</div>

                {footer ? <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div> : null}
            </div>
        </div>
    );
}
