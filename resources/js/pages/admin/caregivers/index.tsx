import { Link, router } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { Avatar, EmptyState, PageHeader, Pagination, SearchForm } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { User } from '@/types';

interface CaregiverItem extends User {
    enrollments_count: number;
    certificates_count: number;
    quiz_attempts_count: number;
    lesson_progress_count: number;
}

interface Props {
    caregivers: {
        data: CaregiverItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    search: string;
}

export default function CaregiversIndex({ caregivers, search }: Props) {
    return (
        <AdminLayout title="Caregivers">
            <PageHeader title="Caregivers" description="Everyone enrolled on the platform and their progress." />

            <div className="mb-6">
                <SearchForm
                    defaultValue={search}
                    placeholder="Search by name or email"
                    onSearch={(term) =>
                        router.get('/admin/caregivers', term ? { search: term } : {}, { preserveState: true })
                    }
                />
            </div>

            {caregivers.data.length === 0 ? (
                <EmptyState
                    icon={<Users className="size-5" />}
                    title={search ? 'No caregivers match that search' : 'No caregivers yet'}
                    description={
                        search ? 'Try a different name or email address.' : 'Registered caregivers will appear here.'
                    }
                />
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Caregiver</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Enrolled</th>
                                    <th scope="col">Lessons</th>
                                    <th scope="col">Assessments</th>
                                    <th scope="col">Certificates</th>
                                </tr>
                            </thead>
                            <tbody>
                                {caregivers.data.map((caregiver) => (
                                    <tr key={caregiver.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    name={caregiver.name}
                                                    src={caregiver.avatar}
                                                    className="size-8"
                                                />
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/admin/caregivers/${caregiver.id}`}
                                                        className="font-medium text-ink hover:text-accent-ink"
                                                    >
                                                        {caregiver.name}
                                                    </Link>
                                                    <span className="block truncate text-sm text-ink-subtle">
                                                        {caregiver.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-ink-muted">{caregiver.specialization || '-'}</td>
                                        <td className="tabular">{caregiver.enrollments_count}</td>
                                        <td className="tabular">{caregiver.lesson_progress_count}</td>
                                        <td className="tabular">{caregiver.quiz_attempts_count}</td>
                                        <td className="tabular">{caregiver.certificates_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={caregivers.links} total={caregivers.total} unit="caregivers" />
                </>
            )}
        </AdminLayout>
    );
}
