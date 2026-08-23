<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ModuleController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'estimated_minutes' => ['required', 'integer', 'min:5'],
            'order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (Module::where('course_id', $course->id)->where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $module = Module::create([
            'course_id' => $course->id,
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'estimated_minutes' => $validated['estimated_minutes'],
            'order' => $validated['order'] ?? ($course->modules()->count() + 1),
            'is_published' => $validated['is_published'] ?? true,
        ]);

        ActivityLogger::log(
            'admin.content_created',
            "Administrator added module '{$module->title}' to course '{$course->title}'.",
            ['module_id' => $module->id, 'course_id' => $course->id]
        );

        return back()->with('success', "Module '{$module->title}' created successfully.");
    }

    public function update(Request $request, Module $module): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'estimated_minutes' => ['required', 'integer', 'min:5'],
            'order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ]);

        $module->update($validated);

        ActivityLogger::log(
            'admin.content_updated',
            "Administrator updated module '{$module->title}'.",
            ['module_id' => $module->id]
        );

        return back()->with('success', "Module '{$module->title}' updated successfully.");
    }

    public function destroy(Module $module): RedirectResponse
    {
        $title = $module->title;
        $module->delete();

        ActivityLogger::log(
            'admin.content_deleted',
            "Administrator deleted module '{$title}'.",
            ['module_id' => $module->id]
        );

        return back()->with('success', "Module '{$title}' deleted successfully.");
    }
}
