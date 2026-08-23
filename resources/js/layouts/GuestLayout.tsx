import { Head, Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';
import Brand from '@/components/Brand';
import FlashMessage from '@/components/FlashMessage';
import { ButtonLink } from '@/components/ui';
import { useDrawer } from '@/hooks/useDrawer';
import { cn } from '@/lib/utils';
import type { SharedProps } from '@/types';

interface Props {
    children: ReactNode;
    title?: string;
}

const NAV_LINKS = [
    { name: 'Programs', href: '/programs' },
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Verify a certificate', href: '/verify' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

const FOOTER_COLUMNS = [
    {
        heading: 'Programs',
        links: [
            { name: 'Dementia and memory care', href: '/programs?category=Dementia+%26+Memory+Care' },
            { name: 'Elderly home health', href: '/programs?category=Elderly+Home+Care' },
            { name: 'Pediatric and special needs', href: '/programs?category=Pediatric+%26+Special+Needs' },
            { name: 'First aid and emergency', href: '/programs?category=Emergency+%26+Safety' },
        ],
    },
    {
        heading: 'Platform',
        links: [
            { name: 'How it works', href: '/how-it-works' },
            { name: 'Clinical advisory board', href: '/about' },
            { name: 'Verify a certificate', href: '/verify' },
            { name: 'Contact and support', href: '/contact' },
        ],
    },
];

export default function GuestLayout({ children, title }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const { isOpen: menuOpen, setIsOpen: setMenuOpen, url } = useDrawer();

    const user = auth?.user;

    // Inertia keeps the layout mounted across visits, so the drawer has to be

    const isActive = (href: string) => url === href || url.startsWith(`${href}/`) || url.startsWith(`${href}?`);

    return (
        <div className="flex min-h-screen flex-col bg-canvas">
            <Head title={title ? `${title} | Tend` : 'Tend'} />
            <FlashMessage />

            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                Skip to content
            </a>

            <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
                <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
                    <Brand />

                    <nav aria-label="Main" className="hidden flex-1 items-center gap-0.5 lg:flex">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                                className={cn('nav-link', isActive(link.href) && 'nav-link-active')}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto hidden items-center gap-2 lg:flex">
                        {user ? (
                            <ButtonLink href={user.role === 'admin' ? '/admin/dashboard' : '/caregiver/dashboard'}>
                                {user.role === 'admin' ? 'Admin console' : 'My learning'}
                            </ButtonLink>
                        ) : (
                            <>
                                <ButtonLink href="/login" variant="ghost">
                                    Sign in
                                </ButtonLink>
                                <ButtonLink href="/register">Create account</ButtonLink>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-controls="guest-menu"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="btn btn-ghost ml-auto lg:hidden"
                    >
                        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>

                {menuOpen ? (
                    <div id="guest-menu" className="anim-slide-down border-t border-line bg-surface lg:hidden">
                        <nav aria-label="Main" className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive(link.href) ? 'page' : undefined}
                                    className={cn(
                                        'nav-link w-full justify-start py-2.5 text-[0.9375rem]',
                                        isActive(link.href) && 'nav-link-active',
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="flex flex-col gap-2 border-t border-line pt-4">
                                {user ? (
                                    <ButtonLink
                                        href={user.role === 'admin' ? '/admin/dashboard' : '/caregiver/dashboard'}
                                        size="lg"
                                    >
                                        {user.role === 'admin' ? 'Admin console' : 'My learning'}
                                    </ButtonLink>
                                ) : (
                                    <>
                                        <ButtonLink href="/register" size="lg">
                                            Create account
                                        </ButtonLink>
                                        <ButtonLink href="/login" variant="secondary" size="lg">
                                            Sign in
                                        </ButtonLink>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                ) : null}
            </header>

            <main id="main" className="flex-1">
                {children}
            </main>

            <footer className="border-t border-line bg-surface">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-10 pb-10 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <Brand />
                            <p className="mt-4 max-w-sm text-sm text-ink-muted">
                                Clinical education, competency assessment, and verifiable credentials for personal
                                care aides, nursing assistants, and home caregivers.
                            </p>
                        </div>

                        {FOOTER_COLUMNS.map((column) => (
                            <div key={column.heading}>
                                <h2 className="text-sm font-semibold text-ink">{column.heading}</h2>
                                <ul className="mt-4 space-y-2.5">
                                    {column.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-ink-muted transition hover:text-accent-ink"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
                        <p>&copy; {new Date().getFullYear()} Tend. All rights reserved.</p>
                        <p>
                            Reviewing this project? Demo sign-ins are listed on the{' '}
                            <Link href="/login" className="font-medium text-accent-ink underline underline-offset-2">
                                sign-in page
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
