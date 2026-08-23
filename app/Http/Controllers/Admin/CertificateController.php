<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $query = Certificate::query()
            ->with(['user', 'course', 'module']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        $certificates = $query->latest('issued_at')->paginate(15)->withQueryString();

        return Inertia::render('admin/certificates/index', [
            'certificates' => $certificates,
            'search' => $search ?? '',
        ]);
    }

    public function destroy(Certificate $certificate): RedirectResponse
    {
        $number = $certificate->certificate_number;
        $name = $certificate->recipient_name;
        $certificate->delete();

        ActivityLogger::log(
            'admin.certificate_revoked',
            "Administrator revoked certificate {$number} for {$name}.",
            ['certificate_number' => $number, 'recipient_name' => $name]
        );

        return back()->with('success', "Certificate {$number} has been revoked.");
    }
}
