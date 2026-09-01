import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    href?: string;
    /** Second line under the wordmark, naming the surface the user is in. */
    context?: string;
    className?: string;
}

export default function Brand({ href = '/', context, className }: Props) {
    return (
        <Link href={href} className={cn('flex shrink-0 items-center gap-2.5', className)}>
            <span className="flex size-9 items-center justify-center rounded-control bg-accent text-white shadow-xs ring-1 ring-black/5 dark:text-[#04201d]">
                <ShieldCheck className="size-5" strokeWidth={2.1} />
            </span>
            <span className="min-w-0 leading-tight">
                <span className="block text-[0.9375rem] font-semibold tracking-tight text-ink">
                    Tend
                </span>
                <span className="block truncate text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
                    {context ?? 'Certification Academy'}
                </span>
            </span>
        </Link>
    );
}
