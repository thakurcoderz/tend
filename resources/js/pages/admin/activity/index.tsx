import { router } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import { Badge, EmptyState, PageHeader, Pagination, SearchForm, Select } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { ActivityLog } from '@/types';

interface Props {
    logs: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    eventTypes: Record<string, string>;
    selectedEventType: string;
    selectedUserId: string;
    search: string;
}

/** Maps an event type to a badge tone so the log scans by colour, not by reading. */
function toneFor(eventType: string): 'ok' | 'accent' | 'warn' | 'info' | 'neutral' {
    if (eventType.includes('completed') || eventType.includes('passed')) {
        return 'ok';
    }

    if (eventType.includes('certificate')) {
        return 'accent';
    }

    if (eventType.includes('failed')) {
        return 'warn';
    }

    if (eventType.includes('enrolled') || eventType.includes('login')) {
        return 'info';
    }

    return 'neutral';
}

export default function ActivityIndex({ logs, eventTypes, selectedEventType, search }: Props) {
    const applyFilters = (changes: Record<string, string>) =>
        router.get(
            '/admin/activity',
            Object.fromEntries(
                Object.entries({ event_type: selectedEventType, search, ...changes }).filter(
                    ([, value]) => value && value !== 'all',
                ),
            ),
            { preserveState: true },
        );

    return (
        <AdminLayout title="Activity log">
            <PageHeader title="Activity log" description="An audit trail of everything happening on the platform." />

            <div className="mb-6 flex flex-wrap items-end gap-3">
                <SearchForm
                    defaultValue={search}
                    placeholder="Search activity"
                    onSearch={(term) => applyFilters({ search: term })}
                />

                <div>
                    <label htmlFor="event_type" className="label">
                        Event type
                    </label>
                    <Select
                        id="event_type"
                        value={selectedEventType || 'all'}
                        onChange={(event) => applyFilters({ event_type: event.target.value })}
                        className="w-56"
                    >
                        <option value="all">All events</option>
                        {Object.entries(eventTypes).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {logs.data.length === 0 ? (
                <EmptyState
                    icon={<Activity className="size-5" />}
                    title="No activity found"
                    description="Try clearing the filters to see the full log."
                />
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Event</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">User</th>
                                    <th scope="col">When</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.data.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <Badge tone={toneFor(log.event_type)}>
                                                {eventTypes[log.event_type] ?? log.event_type.replace(/_/g, ' ')}
                                            </Badge>
                                        </td>
                                        <td className="text-ink">{log.description}</td>
                                        <td className="text-ink-muted">{log.user?.name ?? 'System'}</td>
                                        <td className="whitespace-nowrap text-ink-muted">
                                            {new Date(log.created_at).toLocaleString(undefined, {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={logs.links} total={logs.total} unit="events" />
                </>
            )}
        </AdminLayout>
    );
}
