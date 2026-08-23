<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function create(Module $module): Response
    {
        $module->load('course');

        return Inertia::render('admin/quizzes/create', [
            'module' => $module,
            'course' => $module->course,
        ]);
    }

    public function store(Request $request, Module $module): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'passing_score' => ['required', 'integer', 'min:1', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1'],
            'is_published' => ['boolean'],
        ]);

        $quiz = Quiz::create([
            'module_id' => $module->id,
            'course_id' => $module->course_id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'passing_score' => $validated['passing_score'],
            'time_limit_minutes' => $validated['time_limit_minutes'] ?? 15,
            'is_published' => $validated['is_published'] ?? true,
        ]);

        ActivityLogger::log(
            'admin.content_created',
            "Administrator created quiz '{$quiz->title}' for module '{$module->title}'.",
            ['quiz_id' => $quiz->id, 'module_id' => $module->id]
        );

        return redirect()->route('admin.quizzes.edit', $quiz->id)
            ->with('success', "Quiz '{$quiz->title}' created! You can now add questions and options.");
    }

    public function edit(Quiz $quiz): Response
    {
        $quiz->load([
            'module.course',
            'course',
            'questions.options',
        ]);

        return Inertia::render('admin/quizzes/edit', [
            'quiz' => $quiz,
            'module' => $quiz->module,
            'course' => $quiz->course ?? $quiz->module?->course,
        ]);
    }

    public function update(Request $request, Quiz $quiz): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'passing_score' => ['required', 'integer', 'min:1', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1'],
            'is_published' => ['boolean'],
        ]);

        $quiz->update($validated);

        ActivityLogger::log(
            'admin.content_updated',
            "Administrator updated quiz settings for '{$quiz->title}'.",
            ['quiz_id' => $quiz->id]
        );

        return back()->with('success', "Quiz '{$quiz->title}' updated successfully.");
    }

    public function storeQuestion(Request $request, Quiz $quiz): RedirectResponse
    {
        $validated = $request->validate([
            'question_text' => ['required', 'string'],
            'explanation' => ['nullable', 'string'],
            'points' => ['required', 'integer', 'min:1'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.option_text' => ['required', 'string'],
            'options.*.is_correct' => ['required', 'boolean'],
        ]);

        $question = Question::create([
            'quiz_id' => $quiz->id,
            'question_text' => $validated['question_text'],
            'explanation' => $validated['explanation'] ?? null,
            'points' => $validated['points'],
            'order' => $quiz->questions()->count() + 1,
        ]);

        foreach ($validated['options'] as $idx => $opt) {
            QuestionOption::create([
                'question_id' => $question->id,
                'option_text' => $opt['option_text'],
                'is_correct' => (bool) $opt['is_correct'],
                'order' => $idx + 1,
            ]);
        }

        ActivityLogger::log(
            'admin.content_created',
            "Administrator added question to quiz '{$quiz->title}'.",
            ['quiz_id' => $quiz->id, 'question_id' => $question->id]
        );

        return back()->with('success', 'Question and options added successfully.');
    }

    public function destroyQuestion(Question $question): RedirectResponse
    {
        $quizId = $question->quiz_id;
        $question->delete();

        return back()->with('success', 'Question deleted.');
    }

    public function destroy(Quiz $quiz): RedirectResponse
    {
        $courseId = $quiz->course_id ?? $quiz->module?->course_id;
        $title = $quiz->title;
        $quiz->delete();

        ActivityLogger::log(
            'admin.content_deleted',
            "Administrator deleted quiz '{$title}'.",
            ['title' => $title]
        );

        return redirect()->route('admin.courses.edit', $courseId)
            ->with('success', "Quiz '{$title}' deleted.");
    }
}
