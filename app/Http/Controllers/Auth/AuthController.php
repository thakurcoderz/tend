<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return Auth::user()->isAdmin()
                ? redirect()->route('admin.dashboard')
                : redirect()->route('caregiver.dashboard');
        }

        return Inertia::render('auth/login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        ActivityLogger::log(
            'auth.login',
            "{$user->name} logged into the portal.",
            ['role' => $user->role, 'email' => $user->email],
            $user
        );

        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard'))
                ->with('success', "Welcome back, Administrator {$user->name}!");
        }

        return redirect()->intended(route('caregiver.dashboard'))
            ->with('success', "Welcome back, {$user->name}! Ready to continue your caregiving training?");
    }

    public function showRegister(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return Auth::user()->isAdmin()
                ? redirect()->route('admin.dashboard')
                : redirect()->route('caregiver.dashboard');
        }

        return Inertia::render('auth/register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
            'specialization' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'caregiver',
            'phone' => $validated['phone'] ?? null,
            'specialization' => $validated['specialization'] ?? 'Caregiver Trainee',
            'bio' => $validated['bio'] ?? null,
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        ActivityLogger::log(
            'auth.register',
            "New caregiver account registered: {$user->name} ({$user->email}).",
            ['specialization' => $user->specialization],
            $user
        );

        return redirect()->route('caregiver.dashboard')
            ->with('success', 'Your caregiver account has been created successfully! Welcome to the Academy.');
    }

    public function logout(Request $request): RedirectResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if ($user) {
            ActivityLogger::log(
                'auth.logout',
                "{$user->name} logged out from the portal.",
                ['role' => $user->role],
                $user
            );
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')
            ->with('info', 'You have been signed out successfully.');
    }
}
