<?php

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\User;
use Database\Seeders\CaregiverPlatformSeeder;

beforeEach(function () {
    $this->seed(CaregiverPlatformSeeder::class);
    $this->caregiver = User::where('email', 'caregiver@caregiver.test')->first();
});

test('caregiver can view their dashboard with progress stats', function () {
    $response = $this->actingAs($this->caregiver)->get(route('caregiver.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('caregiver/dashboard')
        ->has('stats')
        ->has('activeEnrollments')
        ->has('recentCertificates')
        ->has('recentActivities')
    );
});

test('caregiver can view courses catalog and course syllabus', function () {
    $response = $this->actingAs($this->caregiver)->get(route('caregiver.courses.index'));
    $response->assertOk();

    $course = Course::first();
    $showResponse = $this->actingAs($this->caregiver)->get(route('caregiver.courses.show', $course->slug));
    $showResponse->assertOk();
});

test('caregiver can enroll in a course and activity is logged', function () {
    $newCourse = Course::where('slug', 'emergency-first-aid-cpr-life-safety')->first();

    $response = $this->actingAs($this->caregiver)->post(route('caregiver.courses.enroll', $newCourse->id));

    $response->assertRedirect(route('caregiver.courses.show', $newCourse->slug));

    $this->assertDatabaseHas('enrollments', [
        'user_id' => $this->caregiver->id,
        'course_id' => $newCourse->id,
        'status' => 'in_progress',
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'course.enrolled',
        'user_id' => $this->caregiver->id,
    ]);
});

test('caregiver can view a lesson and mark it complete which updates course progress', function () {
    $course = Course::where('slug', 'certified-dementia-alzheimers-care-specialist')->first();
    $module = $course->modules()->first();
    $lesson = $module->lessons()->first();

    $viewResponse = $this->actingAs($this->caregiver)->get(
        route('caregiver.learning.lesson', [$course->slug, $module->slug, $lesson->slug])
    );
    $viewResponse->assertOk();

    $completeResponse = $this->actingAs($this->caregiver)->post(
        route('caregiver.learning.complete', $lesson->id)
    );

    $this->assertDatabaseHas('lesson_progress', [
        'user_id' => $this->caregiver->id,
        'lesson_id' => $lesson->id,
        'status' => 'completed',
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'lesson.completed',
        'user_id' => $this->caregiver->id,
    ]);
});

test('caregiver taking quiz with passing score generates certificate and logs event', function () {
    $course = Course::where('slug', 'certified-dementia-alzheimers-care-specialist')->first();
    $quiz = Quiz::where('course_id', $course->id)->first();
    $quiz->load('questions.options');

    // Build answers map with all correct option IDs
    $answers = [];
    foreach ($quiz->questions as $q) {
        $correct = $q->options->firstWhere('is_correct', true);
        if ($correct) {
            $answers[$q->id] = $correct->id;
        }
    }

    $submitResponse = $this->actingAs($this->caregiver)->post(
        route('caregiver.quizzes.submit', $quiz->id),
        ['answers' => $answers]
    );

    $submitResponse->assertOk();
    $submitResponse->assertInertia(fn ($page) => $page
        ->component('caregiver/quizzes/result')
        ->where('passed', true)
        ->where('percentage', 100)
    );

    // Verify certificate was created
    $this->assertDatabaseHas('certificates', [
        'user_id' => $this->caregiver->id,
        'course_id' => $course->id,
    ]);

    // Verify activity logs
    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'quiz.passed',
        'user_id' => $this->caregiver->id,
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'certificate.issued',
        'user_id' => $this->caregiver->id,
    ]);
});

test('caregiver can view earned certificates and academic transcript', function () {
    $this->actingAs($this->caregiver)->get(route('caregiver.certificates.index'))->assertOk();
    $this->actingAs($this->caregiver)->get(route('caregiver.transcript'))->assertOk();
});
