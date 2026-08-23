import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type {FormEvent} from 'react';
import LessonFormFields from '@/components/admin/LessonFormFields';
import { Button, ButtonLink, Card, PageHeader } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { Course, Lesson, Module } from '@/types';

interface Props {
    lesson: Lesson;
    module: Module;
    course: Course;
}

export default function LessonEdit({ lesson, module, course }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: lesson.title,
        content_type: lesson.content_type as string,
        duration_minutes: lesson.duration_minutes,
        summary: lesson.summary || '',
        body: lesson.body,
        video_url: lesson.video_url || '',
        audio_url: lesson.audio_url || '',
        key_takeaways: lesson.key_takeaways?.length ? lesson.key_takeaways : [''],
        clinical_checklist: lesson.clinical_checklist?.length ? lesson.clinical_checklist : [''],
        is_published: lesson.is_published,
        order: lesson.order,
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        put(`/admin/lessons/${lesson.id}`);
    };

    return (
        <AdminLayout title={lesson.title}>
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
                    title="Edit lesson"
                    description={`In module: ${module.title}`}
                />

                <form onSubmit={handleSubmit} noValidate>
                    <Card className="p-6">
                        <LessonFormFields data={data} errors={errors} setData={setData} />
                    </Card>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? 'Saving...' : 'Save changes'}
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
