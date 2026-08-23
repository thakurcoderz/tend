import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SharedProps } from '@/types';

const TONES = {
    success: { icon: CheckCircle2, className: 'border-ok-line bg-ok-soft text-ok', role: 'status' },
    error: { icon: AlertCircle, className: 'border-danger-line bg-danger-soft text-danger', role: 'alert' },
    info: { icon: Info, className: 'border-info-line bg-info-soft text-info', role: 'status' },
} as const;

export default function FlashMessage() {
    const { flash } = usePage<SharedProps>().props;
    // Holds the message that was dismissed, so a new flash shows again without
    // needing an effect to reset a boolean.
    const [dismissed, setDismissed] = useState<string | null>(null);

    const entry = (['success', 'error', 'info'] as const).find((key) => flash?.[key]);
    const message = entry ? flash[entry] : null;

    useEffect(() => {
        // Errors stay until dismissed; the user may need to act on them.
        if (!message || entry === 'error') {
            return;
        }

        const timer = setTimeout(() => setDismissed(message), 6000);

        return () => clearTimeout(timer);
    }, [message, entry]);

    if (!entry || !message || dismissed === message) {
        return null;
    }

    const { icon: Icon, className, role } = TONES[entry];

    return (
        <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:top-6 sm:justify-end">
            <div
                role={role}
                className={`anim-slide-down pointer-events-auto flex w-full items-start gap-3 rounded-card border p-3.5 shadow-lg sm:max-w-sm ${className}`}
            >
                <Icon className="mt-0.5 size-4.5 shrink-0" />
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    type="button"
                    onClick={() => setDismissed(message)}
                    aria-label="Dismiss notification"
                    className="-m-1 rounded-control p-1 opacity-70 transition hover:opacity-100"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}
