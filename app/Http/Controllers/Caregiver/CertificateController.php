<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $certificates = Certificate::query()
            ->where('user_id', $user->id)
            ->with(['course', 'module'])
            ->latest('issued_at')
            ->get();

        return Inertia::render('caregiver/certificates/index', [
            'certificates' => $certificates,
        ]);
    }

    public function show(string $certificateNumber): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $certificate = Certificate::query()
            ->where('certificate_number', $certificateNumber)
            ->where('user_id', $user->id)
            ->with(['course', 'module', 'user'])
            ->firstOrFail();

        ActivityLogger::log(
            'certificate.viewed',
            "Caregiver {$user->name} viewed certificate {$certificate->certificate_number}.",
            ['certificate_number' => $certificate->certificate_number],
            $user
        );

        return Inertia::render('caregiver/certificates/show', [
            'certificate' => $certificate,
        ]);
    }
}
