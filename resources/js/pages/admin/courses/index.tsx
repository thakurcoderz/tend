import { Link, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff, PlusCircle, Trash2 } from 'lucide-react';
import { Badge, ButtonLink, EmptyState, PageHeader, SearchForm } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { Course } from '@/types';

interface Props {
    courses: (Course & {
        modules_count: number;
        lessons_count: number;
        enrollments_count: number;
    })[];
    search: string;
}

export default function CoursesIndex({ courses, search }: Props) {
    const { post, delete: destroy, processing } = useForm();

    const handleDelete = (course: Course) => {
        if (window.confirm(`Delete "${course.title}"? This removes its modules, lessons, and assessments.`)) {
            destroy(`/admin/courses/${course.id}`);
        }
    };

    return (
        <AdminLayout title="Courses">
            <PageHeader
                title="Courses"
                description="Create and publish certification programs."
                actions={
                    <ButtonLink href="/admin/courses/create">
                        <PlusCircle className="size-4" />
                        New course
                    </ButtonLink>
                }
            />

            <div className="mb-6">
                <SearchForm
                    defaultValue={search}
                    placeholder="Search courses"
                    onSearch={(term) => router.get('/admin/courses', term ? { search: term } : {}, { preserveState: true })}
                />
            </div>

            {courses.length === 0 ? (
                <EmptyState
                    title={search ? 'No courses match that search' : 'No courses yet'}
                    description={
                        search
                            ? 'Try a different term, or clear the search to see everything.'
                            : 'Create your first certification program to get started.'
                    }
                    action={<ButtonLink href="/admin/courses/create">New course</ButtonLink>}
                />
            ) : (
                <div className="table-wrap">
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th scope="col">Course</th>
                                <th scope="col">Modules</th>
                                <th scope="col">Lessons</th>
                                <th scope="col">Enrolled</th>
                                <th scope="col">Status</th>
                                <th scope="col">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>
                                        <Link
                                            href={`/admin/courses/${course.id}/edit`}
                                            className="font-medium text-ink hover:text-accent-ink"
                                        >
                                            {course.title}
                                        </Link>
                                        <span className="block text-sm text-ink-subtle">{course.category}</span>
                                    </td>
                                    <td className="tabular">{course.modules_count}</td>
                                    <td className="tabular">{course.lessons_count}</td>
                                    <td className="tabular">{course.enrollments_count}</td>
                                    <td>
                                        <Badge tone={course.is_published ? 'ok' : 'neutral'}>
                                            {course.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-1">
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => post(`/admin/courses/${course.id}/toggle-publish`)}
                                                className="btn btn-ghost btn-sm"
                                                title={course.is_published ? 'Unpublish' : 'Publish'}
                                            >
                                                {course.is_published ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                                <span className="sr-only">
                                                    {course.is_published ? 'Unpublish' : 'Publish'} {course.title}
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => handleDelete(course)}
                                                className="btn btn-ghost btn-sm text-danger"
                                                title="Delete"
                                            >
                                                <Trash2 className="size-4" />
                                                <span className="sr-only">Delete {course.title}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
