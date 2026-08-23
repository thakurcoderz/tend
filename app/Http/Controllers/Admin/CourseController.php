<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $query = Course::query()
            ->withCount(['modules', 'lessons', 'enrollments'])
            ->with(['modules.lessons', 'modules.quiz']);

        if ($search) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%");
        }

        $courses = $query->orderBy('order')->get();

        return Inertia::render('admin/courses/index', [
            'courses' => $courses,
            'search' => $search ?? '',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/courses/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'badge_title' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'level' => ['required', 'string', 'max:50'],
            'summary' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'estimated_hours' => ['required', 'integer', 'min:1'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'is_published' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (Course::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $course = Course::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'badge_title' => $validated['badge_title'] ?? null,
            'category' => $validated['category'],
            'level' => $validated['level'],
            'summary' => $validated['summary'],
            'description' => $validated['description'],
            'estimated_hours' => $validated['estimated_hours'],
            'thumbnail' => $validated['thumbnail'] ?: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
            'is_published' => $validated['is_published'] ?? true,
            'order' => $validated['order'] ?? Course::count() + 1,
        ]);

        ActivityLogger::log(
            'admin.content_created',
            "Administrator created new certification course '{$course->title}'.",
            ['course_id' => $course->id, 'title' => $course->title]
        );

        return redirect()->route('admin.courses.edit', $course->id)
            ->with('success', "Course '{$course->title}' created! You can now add modules and lessons.");
    }

    public function edit(Course $course): Response
    {
        $course->load([
            'modules' => function ($query) {
                $query->orderBy('order')->with([
                    'lessons' => fn ($q) => $q->orderBy('order'),
                    'quiz.questions.options',
                ]);
            },
        ]);

        return Inertia::render('admin/courses/edit', [
            'course' => $course,
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'badge_title' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'level' => ['required', 'string', 'max:50'],
            'summary' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'estimated_hours' => ['required', 'integer', 'min:1'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'is_published' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $course->update($validated);

        ActivityLogger::log(
            'admin.content_updated',
            "Administrator updated course '{$course->title}'.",
            ['course_id' => $course->id]
        );

        return back()->with('success', "Course '{$course->title}' updated successfully!");
    }

    public function destroy(Course $course): RedirectResponse
    {
        $title = $course->title;
        $courseId = $course->id;

        $course->delete();

        ActivityLogger::log(
            'admin.content_deleted',
            "Administrator deleted course '{$title}'.",
            ['course_id' => $courseId, 'title' => $title]
        );

        return redirect()->route('admin.courses.index')
            ->with('success', "Course '{$title}' deleted successfully.");
    }

    public function togglePublish(Course $course): RedirectResponse
    {
        $course->update(['is_published' => ! $course->is_published]);

        $status = $course->is_published ? 'published' : 'unpublished';
        ActivityLogger::log(
            'admin.content_updated',
            "Administrator {$status} course '{$course->title}'.",
            ['course_id' => $course->id, 'status' => $status]
        );

        return back()->with('success', "Course status changed to {$status}.");
    }
}
