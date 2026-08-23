import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type {FormEvent} from 'react';
import QuizSettingsFields from '@/components/admin/QuizSettingsFields';
import { Button, ButtonLink, Card, PageHeader } from '@/components/ui';
import AdminLayout from '@/layouts/AdminLayout';
import type { Course, Module } from '@/types';

interface Props {
    module: Module;
    course: Course;
}

export default function QuizCreate({ module, course }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: `${module.title} assessment`,
        description: 'Scenario-based questions covering the procedures and safety protocols in this module.',
        passing_score: 80,
        time_limit_minutes: 15,
        is_published: true,
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(`/admin/modules/${module.id}/quizzes`);
    };

    return (
        <AdminLayout title="New assessment">
            <div className="max-w-2xl">
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
                    title="New assessment"
                    description={`For module: ${module.title}. You can add questions after saving.`}
                />

                <form onSubmit={handleSubmit} noValidate>
                    <Card className="p-6">
                        <QuizSettingsFields data={data} errors={errors} setData={setData} />
                    </Card>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button type="submit" size="lg" disabled={processing}>
                            {processing ? 'Creating...' : 'Create assessment'}
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
