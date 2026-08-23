<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CaregiverManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $query = User::query()
            ->where('role', 'caregiver')
            ->withCount(['enrollments', 'certificates', 'quizAttempts', 'lessonProgress']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        $caregivers = $query->latest('created_at')->paginate(15)->withQueryString();

        return Inertia::render('admin/caregivers/index', [
            'caregivers' => $caregivers,
            'search' => $search ?? '',
        ]);
    }

    public function show(User $user): Response
    {
        if ($user->role !== 'caregiver') {
            abort(404);
        }

        $user->load([
            'enrollments.course.modules',
            'certificates.course',
            'quizAttempts.quiz',
            'lessonProgress.lesson.module',
            'activityLogs' => fn ($q) => $q->latest('created_at')->take(25),
        ]);

        return Inertia::render('admin/caregivers/show', [
            'caregiver' => $user,
        ]);
    }
}
