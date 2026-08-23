<?php

use App\Models\Certificate;
use Database\Seeders\CaregiverPlatformSeeder;

beforeEach(function () {
    $this->seed(CaregiverPlatformSeeder::class);
});

test('guest can view the home page with featured courses and stats', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('guest/home')
        ->has('featuredCourses')
        ->has('stats')
    );
});

test('guest can view the about page with clinical advisors', function () {
    $response = $this->get(route('about'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('guest/about')
        ->has('advisors')
    );
});

test('guest can view the programs page and filter by category', function () {
    $response = $this->get(route('programs'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('guest/programs')
        ->has('courses')
        ->has('categories')
    );

    $filterResponse = $this->get(route('programs', ['category' => 'Dementia & Memory Care']));
    $filterResponse->assertOk();
});

test('guest can view the how it works page', function () {
    $response = $this->get(route('how-it-works'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('guest/how-it-works')
        ->has('steps')
    );
});

test('guest can view contact page and submit contact inquiry which logs activity', function () {
    $response = $this->get(route('contact'));
    $response->assertOk();

    $submitResponse = $this->post(route('contact.submit'), [
        'name' => 'Jane Caregiver',
        'email' => 'jane@example.com',
        'subject' => 'Question about CNA Certification',
        'message' => 'Hello, I would like to know if this course covers pediatric feeding.',
    ]);

    $submitResponse->assertSessionHas('success');

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'guest.contact_submission',
    ]);
});

test('guest can publicly verify a valid certificate code', function () {
    $cert = Certificate::first();
    expect($cert)->not->toBeNull();

    $response = $this->get(route('verify', $cert->certificate_number));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('guest/verify')
        ->where('isValid', true)
        ->where('certificate.certificate_number', $cert->certificate_number)
    );
});

test('guest searching invalid certificate code returns not found state', function () {
    $response = $this->get(route('verify', 'INVALID-CODE-9999'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('guest/verify')
        ->where('isValid', false)
    );
});
