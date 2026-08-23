import { usePage } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Mobile drawer state that closes itself whenever the Inertia URL changes,
 * including on browser back/forward.
 *
 * Uses React's render-phase state adjustment rather than an effect, so the
 * drawer never renders open for a frame after a visit has already started.
 * See https://react.dev/learn/you-might-not-need-an-effect
 */
export function useDrawer() {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const [seenUrl, setSeenUrl] = useState(url);

    if (url !== seenUrl) {
        setSeenUrl(url);
        setIsOpen(false);
    }

    return { isOpen, setIsOpen, url };
}
