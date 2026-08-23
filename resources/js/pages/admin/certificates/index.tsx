import { router } from '@inertiajs/react';
import { Award, Trash2 } from 'lucide-react';
import { EmptyState, PageHeader, Pagination, SearchForm } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { Certificate } from '@/types';

interface Props {
    certificates: {
        data: Certificate[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    search: string;
}

export default function CertificatesIndex({ certificates, search }: Props) {
    const handleRevoke = (certificate: Certificate) => {
        if (
            window.confirm(
                `Revoke certificate ${certificate.certificate_number}? It will stop verifying publicly.`,
            )
        ) {
            router.delete(`/admin/certificates/${certificate.id}`);
        }
    };

    return (
        <AdminLayout title="Certificates">
            <PageHeader
                title="Issued certificates"
                description="Every credential the platform has issued, with its public verification ID."
            />

            <div className="mb-6">
                <SearchForm
                    defaultValue={search}
                    placeholder="Search by recipient or ID"
                    onSearch={(term) =>
                        router.get('/admin/certificates', term ? { search: term } : {}, { preserveState: true })
                    }
                />
            </div>

            {certificates.data.length === 0 ? (
                <EmptyState
                    icon={<Award className="size-5" />}
                    title={search ? 'No certificates match that search' : 'No certificates issued yet'}
                    description={
                        search
                            ? 'Try a different recipient name or verification ID.'
                            : 'Certificates appear here once caregivers pass their assessments.'
                    }
                />
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Certificate</th>
                                    <th scope="col">Recipient</th>
                                    <th scope="col">Verification ID</th>
                                    <th scope="col">Issued</th>
                                    <th scope="col">Score</th>
                                    <th scope="col">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificates.data.map((certificate) => (
                                    <tr key={certificate.id}>
                                        <td className="font-medium">{certificate.title}</td>
                                        <td className="text-ink-muted">{certificate.recipient_name}</td>
                                        <td className="whitespace-nowrap font-mono text-ink-muted">
                                            {certificate.certificate_number}
                                        </td>
                                        <td className="whitespace-nowrap text-ink-muted">{certificate.issued_at}</td>
                                        <td className="tabular">
                                            {certificate.grade_percentage != null
                                                ? `${certificate.grade_percentage}%`
                                                : '-'}
                                        </td>
                                        <td>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRevoke(certificate)}
                                                    className="btn btn-ghost btn-sm text-danger"
                                                    title="Revoke certificate"
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="sr-only">
                                                        Revoke {certificate.certificate_number}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={certificates.links} total={certificates.total} unit="certificates" />
                </>
            )}
        </AdminLayout>
    );
}
