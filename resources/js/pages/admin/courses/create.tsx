import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type {FormEvent} from 'react';
import CourseFormFields, { COURSE_CATEGORIES, COURSE_LEVELS } from '@/components/admin/CourseFormFields';
import { Button, ButtonLink, Card, PageHeader } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';

export default function CourseCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        badge_title: '',
        category: COURSE_CATEGORIES[0],
        level: COURSE_LEVELS[2],
        summary: '',
        description: '',
        estimated_hours: 4,
        thumbnail: '',
        is_published: true,
        order: 1,
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/admin/courses');
    };

    return (
        <AdminLayout title="New course">
            <div className="max-w-3xl">
                <PageHeader
                    breadcrumb={
                        <Link href="/admin/courses" className="inline-flex items-center gap-1.5 hover:text-accent-ink">
                            <ArrowLeft className="size-4" />
                            Courses
                        </Link>
                    }
                    title="New course"
                    description="Set up the program. You can add modules and lessons after saving."
                />

                <form onSubmit={handleSubmit} noValidate>
                    <Card className="p-6">
                        <CourseFormFields data={data} errors={errors} setData={setData} />
                    </Card>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? 'Creating...' : 'Create course'}
                        </Button>
                        <ButtonLink href="/admin/courses" variant="secondary" size="lg">
                            Cancel
                        </ButtonLink>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
