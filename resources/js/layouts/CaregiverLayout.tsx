import { Head, Link, usePage } from '@inertiajs/react';
import { Award, BookOpen, Compass, FileText, LogOut, Menu, User, X } from 'lucide-react';
import type { ReactNode } from 'react';
import Brand from '@/components/Brand';
import FlashMessage from '@/components/FlashMessage';
import { Avatar } from '@/components/ui';
import { useDrawer } from '@/hooks/useDrawer';
import { cn } from '@/lib/utils';
import type { SharedProps } from '@/types';

interface Props {
    children: ReactNode;
    title?: string;
}

const NAV_ITEMS = [
    { name: 'My learning', href: '/caregiver/dashboard', icon: BookOpen },
    { name: 'Browse programs', href: '/caregiver/courses', icon: Compass },
    { name: 'Certificates', href: '/caregiver/certificates', icon: Award },
    { name: 'Transcript', href: '/caregiver/transcript', icon: FileText },
    { name: 'Profile', href: '/caregiver/profile', icon: User },
];

export default function CaregiverLayout({ children, title }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const { isOpen: menuOpen, setIsOpen: setMenuOpen, url } = useDrawer();

    const user = auth?.user;


    const isActive = (href: string) => url === href || url.startsWith(`${href}/`);

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
                    <Brand href="/caregiver/dashboard" context="Learner portal" />

                    <nav aria-label="Portal" className="hidden flex-1 items-center gap-0.5 lg:flex">
                        {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                aria-current={isActive(href) ? 'page' : undefined}
                                className={cn('nav-link', isActive(href) && 'nav-link-active')}
                            >
                                <Icon className="size-4" />
                                {name}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden items-center gap-2.5 border-r border-line pr-3 sm:flex">
                            <Avatar name={user?.name} src={user?.avatar} className="size-8" />
                            <span className="leading-tight">
                                <span className="block text-sm font-medium text-ink">{user?.name}</span>
                                <span className="block max-w-[10rem] truncate text-xs text-ink-subtle">
                                    {user?.specialization || 'Caregiver'}
                                </span>
                            </span>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="btn btn-ghost btn-sm"
                            title="Sign out"
                        >
                            <LogOut className="size-4" />
                            <span className="hidden sm:inline">Sign out</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-expanded={menuOpen}
                            aria-controls="portal-menu"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            className="btn btn-ghost lg:hidden"
                        >
                            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>
                </div>

                {menuOpen ? (
                    <nav
                        id="portal-menu"
                        aria-label="Portal"
                        className="anim-slide-down border-t border-line bg-surface lg:hidden"
                    >
                        <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
                            {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-current={isActive(href) ? 'page' : undefined}
                                    className={cn(
                                        'nav-link w-full justify-start py-2.5 text-[0.9375rem]',
                                        isActive(href) && 'nav-link-active',
                                    )}
                                >
                                    <Icon className="size-4.5" />
                                    {name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                ) : null}
            </header>

            <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>

            <footer className="border-t border-line bg-surface">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>&copy; {new Date().getFullYear()} Tend</p>
                    <div className="flex flex-wrap items-center gap-5">
                        <Link href="/contact" className="transition hover:text-accent-ink">
                            Support
                        </Link>
                        <Link href="/verify" className="transition hover:text-accent-ink">
                            Verify a certificate
                        </Link>
                        <Link href="/how-it-works" className="transition hover:text-accent-ink">
                            Program guidelines
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
