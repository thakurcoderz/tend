<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $eventType = $request->query('event_type');
        $userId = $request->query('user_id');
        $search = $request->query('search');

        $query = ActivityLog::query()->with('user');

        if ($eventType && $eventType !== 'all') {
            $query->where('event_type', 'like', "{$eventType}%");
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $logs = $query->latest('created_at')->paginate(20)->withQueryString();

        $eventTypes = [
            'all' => 'All Event Categories',
            'auth' => 'Authentication & Access (auth.*)',
            'lesson' => 'Lesson Completions (lesson.*)',
            'quiz' => 'Quiz Submissions & Attempts (quiz.*)',
            'certificate' => 'Certificates Issued (certificate.*)',
            'course' => 'Course Enrollments (course.*)',
            'admin' => 'Admin Content Modifications (admin.*)',
        ];

        return Inertia::render('admin/activity/index', [
            'logs' => $logs,
            'eventTypes' => $eventTypes,
            'selectedEventType' => $eventType ?? 'all',
            'selectedUserId' => $userId ?? '',
            'search' => $search ?? '',
        ]);
    }
}
