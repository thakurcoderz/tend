<?php

use App\Models\Course;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\User;
use Database\Seeders\CaregiverPlatformSeeder;

beforeEach(function () {
    $this->seed(CaregiverPlatformSeeder::class);
    $this->admin = User::where('email', 'admin@caregiver.test')->first();
    $this->caregiver = User::where('email', 'caregiver@caregiver.test')->first();
});

test('non-admin caregiver cannot access admin console routes', function () {
    $response = $this->actingAs($this->caregiver)->get(route('admin.dashboard'));
    $response->assertRedirect(route('caregiver.dashboard'));
});

test('admin can access dashboard and view metrics', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('metrics')
        ->has('recentActivities')
        ->has('recentCertificates')
    );
});

test('admin can create a new certification course track', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.courses.store'), [
        'title' => 'Palliative Hospice & End-of-Life Comfort (PHEC)',
        'badge_title' => 'PHEC Hospice Credential',
        'category' => 'Palliative & Hospice Care',
        'level' => 'Advanced',
        'summary' => 'Pain management protocols and emotional support in hospice care.',
        'description' => 'Comprehensive clinical guidance for end-of-life comfort care.',
        'estimated_hours' => 5,
        'thumbnail' => 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
        'is_published' => true,
    ]);

    $course = Course::where('slug', 'palliative-hospice-end-of-life-comfort-phec')->first();
    expect($course)->not->toBeNull();
    $response->assertRedirect(route('admin.courses.edit', $course->id));

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'admin.content_created',
    ]);
});

test('admin can add a module and a lesson to a course', function () {
    $course = Course::first();

    // 1. Add module
    $moduleResponse = $this->actingAs($this->admin)->post(route('admin.modules.store', $course->id), [
        'title' => 'Advanced Pain Scale & Non-Verbal Assessment',
        'description' => 'Observing non-verbal pain cues in non-communicative patients.',
        'estimated_minutes' => 35,
    ]);
    $moduleResponse->assertSessionHas('success');

    $module = Module::where('course_id', $course->id)->where('title', 'Advanced Pain Scale & Non-Verbal Assessment')->first();
    expect($module)->not->toBeNull();

    // 2. Add lesson
    $lessonResponse = $this->actingAs($this->admin)->post(route('admin.lessons.store', $module->id), [
        'title' => 'The PAINAD Scale (Pain Assessment in Advanced Dementia)',
        'content_type' => 'protocol',
        'duration_minutes' => 20,
        'summary' => 'Standardized 5-item observational scale for dementia pain.',
        'body' => '### PAINAD Protocol Details...',
        'key_takeaways' => ['Breathing, negative vocalization, facial expression, body language, and consolability.'],
        'clinical_checklist' => ['Observe resident breathing independently at rest for 5 minutes'],
        'is_published' => true,
    ]);
    $lessonResponse->assertRedirect(route('admin.courses.edit', $course->id));

    $this->assertDatabaseHas('lessons', [
        'module_id' => $module->id,
        'title' => 'The PAINAD Scale (Pain Assessment in Advanced Dementia)',
    ]);
});

test('admin can create a quiz and add questions with options', function () {
    $module = Module::first();

    $quizResponse = $this->actingAs($this->admin)->post(route('admin.quizzes.store', $module->id), [
        'title' => 'PAINAD Observational Competency Quiz',
        'description' => 'Assessing pain observation proficiency.',
        'passing_score' => 80,
        'time_limit_minutes' => 15,
        'is_published' => true,
    ]);

    $quiz = Quiz::where('title', 'PAINAD Observational Competency Quiz')->first();
    expect($quiz)->not->toBeNull();

    // Add question
    $questionResponse = $this->actingAs($this->admin)->post(route('admin.quizzes.questions.store', $quiz->id), [
        'question_text' => 'Which of the following is one of the 5 categories evaluated on the PAINAD pain scale?',
        'explanation' => 'Breathing independent of vocalization is item #1 on PAINAD.',
        'points' => 25,
        'options' => [
            ['option_text' => 'Breathing independent of vocalization', 'is_correct' => true],
            ['option_text' => 'Hair length', 'is_correct' => false],
            ['option_text' => 'Shoe size', 'is_correct' => false],
            ['option_text' => 'Favorite flavor of ice cream', 'is_correct' => false],
        ],
    ]);

    $questionResponse->assertSessionHas('success');

    $this->assertDatabaseHas('questions', [
        'quiz_id' => $quiz->id,
        'question_text' => 'Which of the following is one of the 5 categories evaluated on the PAINAD pain scale?',
    ]);
});

test('admin can inspect caregivers roster, dossier, and activity logs', function () {
    $this->actingAs($this->admin)->get(route('admin.caregivers.index'))->assertOk();
    $this->actingAs($this->admin)->get(route('admin.caregivers.show', $this->caregiver->id))->assertOk();
    $this->actingAs($this->admin)->get(route('admin.activity.index'))->assertOk();
    $this->actingAs($this->admin)->get(route('admin.activity.index', ['event_type' => 'auth']))->assertOk();
});
