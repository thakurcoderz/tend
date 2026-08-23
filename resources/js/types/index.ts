export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'caregiver';
    phone?: string | null;
    avatar?: string | null;
    bio?: string | null;
    specialization?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Auth {
    user: User | null;
}

export interface Flash {
    success?: string | null;
    error?: string | null;
    info?: string | null;
}

export interface SharedProps {
    name: string;
    auth: Auth;
    flash: Flash;
    [key: string]: unknown;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    badge_title?: string | null;
    category: string;
    level: string;
    summary: string;
    description: string;
    estimated_hours: number;
    thumbnail?: string | null;
    icon_name?: string | null;
    is_published: boolean;
    order: number;
    modules_count?: number;
    lessons_count?: number;
    enrollments_count?: number;
    modules?: Module[];
    is_enrolled?: boolean;
    enrollment_status?: 'in_progress' | 'completed' | null;
    progress_percentage?: number;
}

export interface Module {
    id: number;
    course_id: number;
    title: string;
    slug: string;
    description?: string | null;
    estimated_minutes: number;
    order: number;
    is_published: boolean;
    course?: Course;
    lessons_count?: number;
    lessons?: Lesson[];
    quiz?: Quiz | null;
}

export interface Lesson {
    id: number;
    module_id: number;
    title: string;
    slug: string;
    content_type: 'text_guide' | 'video' | 'checklist' | 'protocol';
    summary?: string | null;
    body: string;
    video_url?: string | null;
    audio_url?: string | null;
    duration_minutes: number;
    key_takeaways?: string[] | null;
    clinical_checklist?: string[] | null;
    order: number;
    is_published: boolean;
    module?: Module;
}

export interface Quiz {
    id: number;
    course_id?: number | null;
    module_id?: number | null;
    title: string;
    description?: string | null;
    passing_score: number;
    time_limit_minutes?: number | null;
    is_published: boolean;
    course?: Course;
    module?: Module;
    questions?: Question[];
    questions_count?: number;
}

export interface Question {
    id: number;
    quiz_id: number;
    question_text: string;
    explanation?: string | null;
    points: number;
    order: number;
    options?: QuestionOption[];
}

export interface QuestionOption {
    id: number;
    question_id: number;
    option_text: string;
    is_correct?: boolean;
    order: number;
}

export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    status: 'in_progress' | 'completed';
    progress_percentage: number;
    enrolled_at: string;
    completed_at?: string | null;
    course?: Course;
    user?: User;
}

export interface LessonProgress {
    id: number;
    user_id: number;
    lesson_id: number;
    status: 'in_progress' | 'completed';
    completed_at?: string | null;
    lesson?: Lesson;
}

export interface QuizAttempt {
    id: number;
    user_id: number;
    quiz_id: number;
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    user_answers?: Record<string, number> | null;
    started_at?: string | null;
    completed_at: string;
    quiz?: Quiz;
    user?: User;
}

export interface Certificate {
    id: number;
    user_id: number;
    course_id?: number | null;
    module_id?: number | null;
    certificate_number: string;
    title: string;
    recipient_name: string;
    grade_percentage?: number | null;
    verification_hash: string;
    issued_at: string;
    expires_at?: string | null;
    course?: Course | null;
    module?: Module | null;
    user?: User;
}

export interface ActivityLog {
    id: number;
    user_id?: number | null;
    event_type: string;
    description: string;
    properties?: Record<string, unknown> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at: string;
    user?: User | null;
}
