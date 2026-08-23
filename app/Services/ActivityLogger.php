<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Log an activity event.
     *
     * @param  array<string, mixed>  $properties
     */
    public static function log(
        string $eventType,
        string $description,
        array $properties = [],
        ?User $user = null,
    ): ActivityLog {
        $user = $user ?? Auth::user();

        return ActivityLog::create([
            'user_id' => $user?->id,
            'event_type' => $eventType,
            'description' => $description,
            'properties' => $properties,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'created_at' => Carbon::now(),
        ]);
    }
}
