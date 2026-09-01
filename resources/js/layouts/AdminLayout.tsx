import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Award,
    LayoutDashboard,
    Layers,
    LogOut,
    Menu,
    PlusCircle,
    Users,
    X,
} from 'lucide-react';
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

const NAV_LINKS = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Courses', href: '/admin/courses', icon: Layers },
    { name: 'Caregivers', href: '/admin/caregivers', icon: Users },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Activity log', href: '/admin/activity', icon: Activity },
];

export default function AdminLayout({ children, title }: Props) {
    const { auth } = usePage<SharedProps>().props;
    // usePage().url tracks Inertia SPA visits; window.location does not update
    // during a client-side visit, which left the active nav item stale.
    const { isOpen: sidebarOpen, setIsOpen: setSidebarOpen, url } = useDrawer();

    const user = auth?.user;


    const isActive = (href: string) => url === href || url.startsWith(`${href}/`);

    return (
        <div className="min-h-screen bg-canvas">
            <Head title={title ? `${title} | Admin` : 'Admin'} />
            <FlashMessage />

            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                Skip to content
            </a>

            {/* Mobile bar */}
            <div className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
                <Brand href="/admin/dashboard" context="Admin console" />
                <button
                    type="button"
                    onClick={() => setSidebarOpen((open) => !open)}
                    aria-expanded={sidebarOpen}
                    aria-controls="admin-sidebar"
                    aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
                    className="btn btn-ghost"
                >
                    {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {sidebarOpen ? (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
                />
            ) : null}

            <div className="lg:flex">
                <aside
                    id="admin-sidebar"
                    className={cn(
                        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    )}
                >
                    <div className="hidden h-[68px] shrink-0 items-center border-b border-line bg-surface px-5 lg:flex">
                        <Brand href="/admin/dashboard" context="Admin console" />
                    </div>

                    <nav aria-label="Admin" className="flex-1 space-y-0.5 overflow-y-auto p-3">
                        {NAV_LINKS.map(({ name, href, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                aria-current={isActive(href) ? 'page' : undefined}
                                className={cn('nav-link w-full justify-start', isActive(href) && 'nav-link-active')}
                            >
                                <Icon className="size-4" />
                                {name}
                            </Link>
                        ))}

                        <div className="mt-4 rounded-card border border-dashed border-line bg-surface-muted/40 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">Quick create</p>
                            <Link href="/admin/courses/create" className="btn btn-secondary btn-sm mt-2 w-full justify-start">
                                <PlusCircle className="size-4" />
                                New course
                            </Link>
                        </div>
                    </nav>

                    <div className="shrink-0 border-t border-line p-3">
                        <Link href="/caregiver/dashboard" className="nav-link mb-2 w-full justify-start">
                            <Users className="size-4" />
                            Switch to learner view
                        </Link>

                        <div className="flex items-center gap-2.5 rounded-control px-2 py-2">
                            <Avatar name={user?.name} src={user?.avatar} className="size-8" />
                            <span className="min-w-0 flex-1 leading-tight">
                                <span className="block truncate text-sm font-medium text-ink">{user?.name}</span>
                                <span className="block text-xs text-ink-subtle">Administrator</span>
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                title="Sign out"
                                aria-label="Sign out"
                                className="btn btn-ghost btn-sm"
                            >
                                <LogOut className="size-4" />
                            </Link>
                        </div>
                    </div>
                </aside>

                <main id="main" className="min-w-0 flex-1 bg-canvas px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
