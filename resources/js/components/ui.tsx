import { Link } from '@inertiajs/react';
import { useState    } from 'react';
import type {ComponentProps, ElementType, ReactNode} from 'react';
import { cn } from '@/lib/utils';

/* ---------------------------------------------------------------------------
 * Primitives shared across the guest site, learner portal, and admin console.
 * Visual rules live in app.css (.btn, .card, .input, .badge, .tbl); these
 * components only pick the right class and keep the markup honest.
 * ------------------------------------------------------------------------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
};

const sizeClass: Record<Size, string> = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
};

function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string): string {
    return cn('btn', variantClass[variant], sizeClass[size], className);
}

interface ButtonProps extends ComponentProps<'button'> {
    variant?: Variant;
    size?: Size;
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
    return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'size'> {
    variant?: Variant;
    size?: Size;
}

export function ButtonLink({ variant = 'primary', size = 'md', className, ...props }: ButtonLinkProps) {
    return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/* --- Surfaces ----------------------------------------------------------- */

interface CardProps extends ComponentProps<'div'> {
    as?: ElementType;
}

export function Card({ as: Tag = 'div', className, ...props }: CardProps) {
    return <Tag className={cn('card', className)} {...props} />;
}

export function Panel({ className, ...props }: ComponentProps<'div'>) {
    return <div className={cn('panel', className)} {...props} />;
}

/* --- Eyebrow ------------------------------------------------------------ */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return <p className={cn('eyebrow mb-3', className)}>{children}</p>;
}

/* --- Page header -------------------------------------------------------- */

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    breadcrumb?: ReactNode;
    eyebrow?: string;
}

export function PageHeader({ title, description, actions, breadcrumb, eyebrow }: PageHeaderProps) {
    return (
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                {breadcrumb ? <div className="mb-2 text-sm text-ink-subtle">{breadcrumb}</div> : null}
                {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
                <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
                {description ? (
                    <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-ink-muted">{description}</p>
                ) : null}
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
    );
}

/* --- Section (marketing pages) ------------------------------------------ */

interface SectionProps extends ComponentProps<'section'> {
    /** Width of the inner container. `wide` for grids, `prose` for reading. */
    width?: 'wide' | 'prose';
}

export function Section({ width = 'wide', className, children, ...props }: SectionProps) {
    return (
        <section className={cn('px-4 py-14 sm:px-6 sm:py-20 lg:px-8', className)} {...props}>
            <div className={cn('mx-auto', width === 'wide' ? 'max-w-7xl' : 'max-w-3xl')}>{children}</div>
        </section>
    );
}

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    description?: string;
    className?: string;
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
    return (
        <div className={cn('mb-10 max-w-2xl', className)}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
            {description ? <p className="mt-3 leading-relaxed text-ink-muted">{description}</p> : null}
        </div>
    );
}

/* --- Badge -------------------------------------------------------------- */

type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'danger' | 'info';

const toneClass: Record<Tone, string> = {
    neutral: 'badge-neutral',
    accent: 'badge-accent',
    ok: 'badge-ok',
    warn: 'badge-warn',
    danger: 'badge-danger',
    info: 'badge-info',
};

interface BadgeProps extends ComponentProps<'span'> {
    tone?: Tone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
    return <span className={cn('badge', toneClass[tone], className)} {...props} />;
}

/* --- Form field --------------------------------------------------------- */

interface FieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    required?: boolean;
    className?: string;
    children: ReactNode;
}

/** Label above, control, then hint, then error. Never placeholder-as-label. */
export function Field({ label, htmlFor, error, hint, required, className, children }: FieldProps) {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="label">
                {label}
                {required ? (
                    <span className="ml-0.5 text-danger" aria-hidden="true">
                        *
                    </span>
                ) : null}
            </label>
            {children}
            {hint && !error ? <p className="help">{hint}</p> : null}
            {error ? (
                <p className="error-text" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
    return <input className={cn('input', className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
    return <textarea className={cn('textarea', className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
    return <select className={cn('select', className)} {...props} />;
}

/* --- Stat --------------------------------------------------------------- */

interface StatProps {
    label: string;
    value: ReactNode;
    hint?: string;
    icon?: ReactNode;
}

export function Stat({ label, value, hint, icon }: StatProps) {
    return (
        <div className="card p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">{label}</p>
                {icon ? (
                    <span className="flex size-8 items-center justify-center rounded-control bg-accent-soft text-accent-ink">
                        {icon}
                    </span>
                ) : null}
            </div>
            <p className="tabular mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</p>
            {hint ? <p className="mt-1.5 text-sm leading-snug text-ink-subtle">{hint}</p> : null}
        </div>
    );
}

/* --- Progress ----------------------------------------------------------- */

interface ProgressProps {
    value: number;
    label?: string;
    className?: string;
}

export function Progress({ value, label, className }: ProgressProps) {
    // Callers divide to get this, so a zero-length denominator must not reach the DOM.
    const pct = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;

    return (
        <div className={className}>
            {label ? (
                <div className="mb-2 flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">{label}</span>
                    <span className="tabular text-sm font-semibold text-ink">{pct}%</span>
                </div>
            ) : null}
            <div
                className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken ring-1 ring-line/60"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label ?? 'Progress'}
            >
                <div
                    className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

/* --- Empty state -------------------------------------------------------- */

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="card flex flex-col items-center px-6 py-12 text-center sm:py-14">
            {icon ? (
                <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-surface-muted ring-1 ring-line text-accent-ink">
                    {icon}
                </div>
            ) : null}
            <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>
            {description ? <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-muted">{description}</p> : null}
            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}

/* --- Avatar ------------------------------------------------------------- */

interface AvatarProps {
    name?: string | null;
    src?: string | null;
    className?: string;
}

/** Initials fallback. No stock-photo placeholder standing in for a real person. */
export function Avatar({ name, src, className }: AvatarProps) {
    const initials = (name ?? '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    if (src) {
        return (
            <img
                src={src}
                alt=""
                className={cn('size-9 shrink-0 rounded-full object-cover ring-1 ring-line', className)}
            />
        );
    }

    return (
        <span
            aria-hidden="true"
            className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-ink ring-1 ring-accent-line',
                className,
            )}
        >
            {initials || '?'}
        </span>
    );
}

/* --- Pagination --------------------------------------------------------- */

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    /** Plural noun for the count line, e.g. "caregivers". */
    unit: string;
}

export function Pagination({ links, total, unit }: PaginationProps) {
    // Laravel emits "&laquo; Previous" / "Next &raquo;" as HTML entities.
    const clean = (label: string) => label.replace(/&laquo;|&raquo;/g, '').trim();

    return (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="tabular text-sm text-ink-muted">
                {total} {unit}
            </p>

            {links.length > 3 ? (
                <nav aria-label="Pagination" className="flex flex-wrap gap-1">
                    {links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                aria-current={link.active ? 'page' : undefined}
                                className={cn('btn btn-sm', link.active ? 'btn-primary' : 'btn-secondary')}
                            >
                                {clean(link.label)}
                            </Link>
                        ) : (
                            <span key={link.label} className="btn btn-sm btn-ghost opacity-50">
                                {clean(link.label)}
                            </span>
                        ),
                    )}
                </nav>
            ) : null}
        </div>
    );
}

/* --- Search form -------------------------------------------------------- */

interface SearchFormProps {
    defaultValue?: string;
    placeholder?: string;
    /** Called with the trimmed term; the caller issues the Inertia visit. */
    onSearch: (term: string) => void;
}

export function SearchForm({ defaultValue = '', placeholder = 'Search', onSearch }: SearchFormProps) {
    const [term, setTerm] = useState(defaultValue);

    return (
        <form
            role="search"
            onSubmit={(event) => {
                event.preventDefault();
                onSearch(term.trim());
            }}
            className="flex max-w-md gap-2"
        >
            <label htmlFor="search" className="sr-only">
                {placeholder}
            </label>
            <Input
                id="search"
                name="search"
                type="search"
                value={term}
                placeholder={placeholder}
                onChange={(event) => setTerm(event.target.value)}
            />
            <Button type="submit" variant="secondary">
                Search
            </Button>
        </form>
    );
}
