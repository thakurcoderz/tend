import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type {FormEvent} from 'react';
import LessonFormFields from '@/components/admin/LessonFormFields';
import { Button, ButtonLink, Card, PageHeader } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { Course, Module } from '@/types';

interface Props {
    module: Module;
    course: Course;
}

export default function LessonCreate({ module, course }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content_type: 'text_guide',
        duration_minutes: 15,
        summary: '',
        body: '',
        video_url: '',
        audio_url: '',
        key_takeaways: [''],
        clinical_checklist: [''],
        is_published: true,
        order: 1,
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(`/admin/modules/${module.id}/lessons`);
    };

    return (
        <AdminLayout title="New lesson">
            <div className="max-w-3xl">
                <PageHeader
                    breadcrumb={
                        <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="inline-flex items-center gap-1.5 hover:text-accent-ink"
                        >
                            <ArrowLeft className="size-4" />
                            {course.title}
                        </Link>
                    }
                    title="New lesson"
                    description={`Adding to module: ${module.title}`}
                />

                <form onSubmit={handleSubmit} noValidate>
                    <Card className="p-6">
                        <LessonFormFields data={data} errors={errors} setData={setData} />
                    </Card>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? 'Creating...' : 'Create lesson'}
                        </Button>
                        <ButtonLink href={`/admin/courses/${course.id}/edit`} variant="secondary" size="lg">
                            Cancel
                        </ButtonLink>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
