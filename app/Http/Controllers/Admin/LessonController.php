<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Module;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function create(Module $module): Response
    {
        $module->load('course');

        return Inertia::render('admin/lessons/create', [
            'module' => $module,
            'course' => $module->course,
        ]);
    }

    public function store(Request $request, Module $module): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content_type' => ['required', 'string', 'in:text_guide,video,checklist,protocol'],
            'summary' => ['nullable', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'audio_url' => ['nullable', 'string', 'max:500'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'key_takeaways' => ['nullable', 'array'],
            'clinical_checklist' => ['nullable', 'array'],
            'order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (Lesson::where('module_id', $module->id)->where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $lesson = Lesson::create([
            'module_id' => $module->id,
            'title' => $validated['title'],
            'slug' => $slug,
            'content_type' => $validated['content_type'],
            'summary' => $validated['summary'] ?? null,
            'body' => $validated['body'],
            'video_url' => $validated['video_url'] ?? null,
            'audio_url' => $validated['audio_url'] ?? null,
            'duration_minutes' => $validated['duration_minutes'],
            'key_takeaways' => array_values(array_filter($validated['key_takeaways'] ?? [])),
            'clinical_checklist' => array_values(array_filter($validated['clinical_checklist'] ?? [])),
            'order' => $validated['order'] ?? ($module->lessons()->count() + 1),
            'is_published' => $validated['is_published'] ?? true,
        ]);

        ActivityLogger::log(
            'admin.content_created',
            "Administrator created lesson '{$lesson->title}' in module '{$module->title}'.",
            ['lesson_id' => $lesson->id, 'module_id' => $module->id]
        );

        return redirect()->route('admin.courses.edit', $module->course_id)
            ->with('success', "Lesson '{$lesson->title}' created successfully.");
    }

    public function edit(Lesson $lesson): Response
    {
        $lesson->load('module.course');

        return Inertia::render('admin/lessons/edit', [
            'lesson' => $lesson,
            'module' => $lesson->module,
            'course' => $lesson->module->course,
        ]);
    }

    public function update(Request $request, Lesson $lesson): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content_type' => ['required', 'string', 'in:text_guide,video,checklist,protocol'],
            'summary' => ['nullable', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'audio_url' => ['nullable', 'string', 'max:500'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'key_takeaways' => ['nullable', 'array'],
            'clinical_checklist' => ['nullable', 'array'],
            'order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ]);

        $validated['key_takeaways'] = array_values(array_filter($validated['key_takeaways'] ?? []));
        $validated['clinical_checklist'] = array_values(array_filter($validated['clinical_checklist'] ?? []));

        $lesson->update($validated);

        ActivityLogger::log(
            'admin.content_updated',
            "Administrator updated lesson '{$lesson->title}'.",
            ['lesson_id' => $lesson->id]
        );

        return back()->with('success', "Lesson '{$lesson->title}' updated successfully.");
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        $title = $lesson->title;
        $courseId = $lesson->module->course_id;

        $lesson->delete();

        ActivityLogger::log(
            'admin.content_deleted',
            "Administrator deleted lesson '{$title}'.",
            ['title' => $title]
        );

        return redirect()->route('admin.courses.edit', $courseId)
            ->with('success', "Lesson '{$title}' deleted successfully.");
    }
}
