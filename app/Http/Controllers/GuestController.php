<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Course;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    public function home(): Response
    {
        $courses = Course::query()
            ->where('is_published', true)
            ->withCount(['modules', 'lessons'])
            ->orderBy('order')
            ->take(3)
            ->get();

        return Inertia::render('guest/home', [
            'featuredCourses' => $courses,
            'stats' => [
                'activeCaregivers' => '14,200+',
                'certificationsAwarded' => '28,500+',
                'courseHours' => '120+',
                'agencyPartners' => '350+',
            ],
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('guest/about', [
            'advisors' => [
                [
                    'name' => 'Dr. Eleanor Vance, MD',
                    'role' => 'Director of Clinical Curriculum',
                    'credentials' => 'Board Certified Geriatrician, 18+ yrs experience',
                    'image' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
                ],
                [
                    'name' => 'Michael Chen, RN, BSN',
                    'role' => 'Head of Home Health Protocols',
                    'credentials' => 'Clinical Nurse Specialist, Former Hospice Director',
                    'image' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
                ],
                [
                    'name' => 'Elena Rostova, OTR/L',
                    'role' => 'Special Needs & Rehabilitation Lead',
                    'credentials' => 'Occupational Therapist, Pediatric Sensory Specialist',
                    'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
                ],
            ],
        ]);
    }

    public function programs(Request $request): Response
    {
        $category = $request->query('category');
        $query = Course::query()
            ->where('is_published', true)
            ->withCount(['modules', 'lessons'])
            ->with(['modules' => function ($query) {
                $query->where('is_published', true)
                    ->withCount('lessons')
                    ->with(['quiz' => fn ($q) => $q->select('id', 'module_id', 'title', 'passing_score')]);
            }])
            ->orderBy('order');

        if ($category && $category !== 'All') {
            $query->where('category', $category);
        }

        $courses = $query->get();

        $categories = Course::query()
            ->where('is_published', true)
            ->distinct()
            ->pluck('category')
            ->toArray();

        return Inertia::render('guest/programs', [
            'courses' => $courses,
            'categories' => array_values(array_unique(array_merge(['All'], $categories))),
            'selectedCategory' => $category ?? 'All',
        ]);
    }

    public function howItWorks(): Response
    {
        return Inertia::render('guest/how-it-works', [
            'steps' => [
                [
                    'number' => '01',
                    'title' => 'Enroll in Specialized Tracks',
                    'description' => 'Select clinical curriculums designed by geriatricians, pediatric specialists, and licensed home health supervisors.',
                ],
                [
                    'number' => '02',
                    'title' => 'Master Interactive Clinical Modules',
                    'description' => 'Engage with step-by-step transfer checklists, communication scenarios, dysphagia meal safety, and vitals protocols.',
                ],
                [
                    'number' => '03',
                    'title' => 'Pass Competency Evaluations',
                    'description' => 'Demonstrate mastery through situational exam questions with real-time clinical rationale explanations.',
                ],
                [
                    'number' => '04',
                    'title' => 'Earn Verifiable Digital Credentials',
                    'description' => 'Receive tamper-proof digital certificates with unique verification IDs, instantly shareable with healthcare employers and families.',
                ],
            ],
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('guest/contact', [
            'faqs' => [
                [
                    'question' => 'Are Tend certificates recognized by home care agencies?',
                    'answer' => 'Yes! Our curriculums align with state home health aide and personal care assistant training standards. Each certificate includes a unique verification code that employers can check on our public portal in seconds.',
                ],
                [
                    'question' => 'Can I complete lessons on my mobile phone while on shift?',
                    'answer' => 'Absolutely. The platform is 100% mobile-optimized, allowing you to review protocols, watch procedures, and complete quizzes from any smartphone or tablet.',
                ],
                [
                    'question' => 'What happens if I don\'t pass a module quiz on the first attempt?',
                    'answer' => 'You can review the detailed clinical explanations for any questions you missed and retake the quiz after reviewing the lesson content. There is no penalty for retakes.',
                ],
                [
                    'question' => 'Do you offer bulk institutional training for senior care facilities?',
                    'answer' => 'Yes, care organizations can manage employee cohorts, track team compliance, and inspect audit logs directly through our enterprise portal.',
                ],
            ],
        ]);
    }

    public function submitContact(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        ActivityLogger::log(
            'guest.contact_submission',
            "Inquiry received from {$validated['name']} ({$validated['email']}): {$validated['subject']}",
            $validated
        );

        return back()->with('success', 'Thank you for reaching out! Our clinical advisory team will review your inquiry and get back to you within 24 hours.');
    }

    public function verifyCertificate(?string $code = null): Response
    {
        $certificate = $code === null ? null : Certificate::query()
            ->where('certificate_number', $code)
            ->orWhere('verification_hash', $code)
            ->with(['user', 'course', 'module'])
            ->first();

        return Inertia::render('guest/verify', [
            'code' => $code,
            'certificate' => $certificate ? [
                'id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'title' => $certificate->title,
                'recipient_name' => $certificate->recipient_name,
                'grade_percentage' => $certificate->grade_percentage,
                'verification_hash' => $certificate->verification_hash,
                'issued_at' => $certificate->issued_at->format('F d, Y'),
                'expires_at' => $certificate->expires_at?->format('F d, Y'),
                'course' => $certificate->course ? [
                    'id' => $certificate->course->id,
                    'title' => $certificate->course->title,
                    'badge_title' => $certificate->course->badge_title,
                    'category' => $certificate->course->category,
                    'estimated_hours' => $certificate->course->estimated_hours,
                ] : null,
                'user' => [
                    'name' => $certificate->user->name,
                    'avatar' => $certificate->user->avatar,
                    'specialization' => $certificate->user->specialization,
                ],
            ] : null,
            'isValid' => $certificate !== null,
        ]);
    }
}
