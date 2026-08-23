<?php

use App\Http\Controllers\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Admin\CaregiverManagementController as AdminCaregiverManagementController;
use App\Http\Controllers\Admin\CertificateController as AdminCertificateController;
use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\LessonController as AdminLessonController;
use App\Http\Controllers\Admin\ModuleController as AdminModuleController;
use App\Http\Controllers\Admin\QuizController as AdminQuizController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Caregiver\CertificateController as CaregiverCertificateController;
use App\Http\Controllers\Caregiver\CourseController as CaregiverCourseController;
use App\Http\Controllers\Caregiver\DashboardController as CaregiverDashboardController;
use App\Http\Controllers\Caregiver\LearningController as CaregiverLearningController;
use App\Http\Controllers\Caregiver\ProfileController as CaregiverProfileController;
use App\Http\Controllers\Caregiver\QuizController as CaregiverQuizController;
use App\Http\Controllers\Caregiver\TranscriptController as CaregiverTranscriptController;
use App\Http\Controllers\GuestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Guest / Public 5-Page Website & Verification
|--------------------------------------------------------------------------
*/
Route::get('/', [GuestController::class, 'home'])->name('home');
Route::get('/about', [GuestController::class, 'about'])->name('about');
Route::get('/programs', [GuestController::class, 'programs'])->name('programs');
Route::get('/how-it-works', [GuestController::class, 'howItWorks'])->name('how-it-works');
Route::get('/contact', [GuestController::class, 'contact'])->name('contact');
Route::post('/contact', [GuestController::class, 'submitContact'])->name('contact.submit');
Route::get('/verify/{code?}', [GuestController::class, 'verifyCertificate'])->name('verify');

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/*
|--------------------------------------------------------------------------
| Caregiver Portal (Learner UI)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('caregiver')->name('caregiver.')->group(function () {
    Route::get('/dashboard', [CaregiverDashboardController::class, 'index'])->name('dashboard');
    Route::get('/courses', [CaregiverCourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/{slug}', [CaregiverCourseController::class, 'show'])->name('courses.show');
    Route::post('/courses/{course}/enroll', [CaregiverCourseController::class, 'enroll'])->name('courses.enroll');

    // Interactive Learning & Lesson Viewer
    Route::get('/learn/{courseSlug}/{moduleSlug}/{lessonSlug}', [CaregiverLearningController::class, 'lesson'])->name('learning.lesson');
    Route::post('/learn/lessons/{lesson}/complete', [CaregiverLearningController::class, 'complete'])->name('learning.complete');

    // Quizzes & Competency Evaluations
    Route::get('/quizzes/{quiz}', [CaregiverQuizController::class, 'show'])->name('quizzes.show');
    Route::get('/quizzes/{quiz}/take', [CaregiverQuizController::class, 'take'])->name('quizzes.take');
    Route::post('/quizzes/{quiz}/submit', [CaregiverQuizController::class, 'submit'])->name('quizzes.submit');

    // Certificates & Verification
    Route::get('/certificates', [CaregiverCertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/{certificateNumber}', [CaregiverCertificateController::class, 'show'])->name('certificates.show');

    // Transcript & Profile
    Route::get('/transcript', [CaregiverTranscriptController::class, 'index'])->name('transcript');
    Route::get('/profile', [CaregiverProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [CaregiverProfileController::class, 'update'])->name('profile.update');
});

/*
|--------------------------------------------------------------------------
| Admin Portal (CMS & Audit Logs)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Course Track CMS
    Route::get('/courses', [AdminCourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [AdminCourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [AdminCourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}/edit', [AdminCourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [AdminCourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [AdminCourseController::class, 'destroy'])->name('courses.destroy');
    Route::post('/courses/{course}/toggle-publish', [AdminCourseController::class, 'togglePublish'])->name('courses.toggle-publish');

    // Modules CMS
    Route::post('/courses/{course}/modules', [AdminModuleController::class, 'store'])->name('modules.store');
    Route::put('/modules/{module}', [AdminModuleController::class, 'update'])->name('modules.update');
    Route::delete('/modules/{module}', [AdminModuleController::class, 'destroy'])->name('modules.destroy');

    // Lessons CMS
    Route::get('/modules/{module}/lessons/create', [AdminLessonController::class, 'create'])->name('lessons.create');
    Route::post('/modules/{module}/lessons', [AdminLessonController::class, 'store'])->name('lessons.store');
    Route::get('/lessons/{lesson}/edit', [AdminLessonController::class, 'edit'])->name('lessons.edit');
    Route::put('/lessons/{lesson}', [AdminLessonController::class, 'update'])->name('lessons.update');
    Route::delete('/lessons/{lesson}', [AdminLessonController::class, 'destroy'])->name('lessons.destroy');

    // Quizzes & Questions CMS
    Route::get('/modules/{module}/quizzes/create', [AdminQuizController::class, 'create'])->name('quizzes.create');
    Route::post('/modules/{module}/quizzes', [AdminQuizController::class, 'store'])->name('quizzes.store');
    Route::get('/quizzes/{quiz}/edit', [AdminQuizController::class, 'edit'])->name('quizzes.edit');
    Route::put('/quizzes/{quiz}', [AdminQuizController::class, 'update'])->name('quizzes.update');
    Route::delete('/quizzes/{quiz}', [AdminQuizController::class, 'destroy'])->name('quizzes.destroy');
    Route::post('/quizzes/{quiz}/questions', [AdminQuizController::class, 'storeQuestion'])->name('quizzes.questions.store');
    Route::delete('/questions/{question}', [AdminQuizController::class, 'destroyQuestion'])->name('questions.destroy');

    // Caregivers Management
    Route::get('/caregivers', [AdminCaregiverManagementController::class, 'index'])->name('caregivers.index');
    Route::get('/caregivers/{user}', [AdminCaregiverManagementController::class, 'show'])->name('caregivers.show');

    // Certificates Audit & Management
    Route::get('/certificates', [AdminCertificateController::class, 'index'])->name('certificates.index');
    Route::delete('/certificates/{certificate}', [AdminCertificateController::class, 'destroy'])->name('certificates.destroy');

    // Activity & Audit Log Exploration
    Route::get('/activity', [AdminActivityLogController::class, 'index'])->name('activity.index');
});
