<?php

use App\Models\User;
use Database\Seeders\CaregiverPlatformSeeder;
use Illuminate\Support\Facades\Auth;

beforeEach(function () {
    $this->seed(CaregiverPlatformSeeder::class);
});

test('guest can view login and register pages', function () {
    $this->get(route('login'))->assertOk();
    $this->get(route('register'))->assertOk();
});

test('caregiver can log in and is redirected to caregiver dashboard with logged activity', function () {
    $response = $this->post(route('login.submit'), [
        'email' => 'caregiver@caregiver.test',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('caregiver.dashboard'));
    $this->assertAuthenticated();

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'auth.login',
        'user_id' => Auth::id(),
    ]);
});

test('admin can log in and is redirected to admin dashboard with logged activity', function () {
    $response = $this->post(route('login.submit'), [
        'email' => 'admin@caregiver.test',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    $this->assertAuthenticated();

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'auth.login',
        'user_id' => Auth::id(),
    ]);
});

test('new user can register as caregiver and is logged in', function () {
    $response = $this->post(route('register.submit'), [
        'name' => 'Jordan Hope',
        'email' => 'jordan.hope@testcare.org',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'specialization' => 'Hospice & Respite Caregiver',
        'phone' => '+1 555-444-3333',
    ]);

    $response->assertRedirect(route('caregiver.dashboard'));
    $this->assertAuthenticated();

    $user = User::where('email', 'jordan.hope@testcare.org')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe('caregiver');
    expect($user->specialization)->toBe('Hospice & Respite Caregiver');

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'auth.register',
        'user_id' => $user->id,
    ]);
});

test('user can log out and activity is logged', function () {
    $user = User::where('email', 'caregiver@caregiver.test')->first();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));
    $this->assertGuest();

    $this->assertDatabaseHas('activity_logs', [
        'event_type' => 'auth.logout',
        'user_id' => $user->id,
    ]);
});
