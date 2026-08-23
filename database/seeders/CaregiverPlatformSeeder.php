<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CaregiverPlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Admins and Caregivers
        $admin = User::firstOrCreate(
            ['email' => 'admin@caregiver.test'],
            [
                'name' => 'Dr. Eleanor Vance',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'phone' => '+1 (555) 234-5678',
                'avatar' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
                'bio' => 'Director of Clinical Curriculum and Geriatric Education at Tend. 18+ years in healthcare administration and dementia research.',
                'specialization' => 'Clinical Education & Geriatrics',
                'email_verified_at' => Carbon::now(),
            ]
        );

        $caregiver1 = User::firstOrCreate(
            ['email' => 'caregiver@caregiver.test'],
            [
                'name' => 'Maya Lin',
                'role' => 'caregiver',
                'password' => Hash::make('password'),
                'phone' => '+1 (555) 345-6789',
                'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
                'bio' => 'Dedicated senior home care provider passionate about dignity-centered dementia assistance and rehabilitation support.',
                'specialization' => 'Certified Senior Caregiver',
                'email_verified_at' => Carbon::now(),
            ]
        );

        $caregiver2 = User::firstOrCreate(
            ['email' => 'sarah.jenkins@caregiver.test'],
            [
                'name' => 'Sarah Jenkins, CNA',
                'role' => 'caregiver',
                'password' => Hash::make('password'),
                'phone' => '+1 (555) 456-7890',
                'avatar' => 'https://images.unsplash.com/photo-1594824813590-78965a363711?auto=format&fit=crop&q=80&w=256',
                'bio' => 'Certified Nursing Assistant with 6 years experience in post-operative home health and memory care facilities.',
                'specialization' => 'Memory Care Specialist',
                'email_verified_at' => Carbon::now(),
            ]
        );

        $caregiver3 = User::firstOrCreate(
            ['email' => 'marcus.reyes@caregiver.test'],
            [
                'name' => 'Marcus Reyes',
                'role' => 'caregiver',
                'password' => Hash::make('password'),
                'phone' => '+1 (555) 567-8901',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
                'bio' => 'Pediatric support specialist and special needs respite caregiver focused on autism support and sensory therapy.',
                'specialization' => 'Pediatric & Special Needs Aide',
                'email_verified_at' => Carbon::now(),
            ]
        );

        // 2. Create Courses / Tracks
        // COURSE 1: Dementia & Alzheimer's Care Specialist
        $course1 = Course::create([
            'title' => "Certified Dementia & Alzheimer's Care Specialist (CADCS)",
            'slug' => 'certified-dementia-alzheimers-care-specialist',
            'badge_title' => 'CADCS Accredited Credential',
            'category' => 'Dementia & Memory Care',
            'level' => 'Intermediate',
            'summary' => 'Evidence-based clinical competencies in communication, validation therapy, behavioral de-escalation, and fall prevention for cognitive decline.',
            'description' => "Caring for individuals with Alzheimer's disease and other forms of dementia requires specialized empathy, clinical understanding of neuropathology, and proactive safety management. This comprehensive certification track equips caregivers with practical techniques to alleviate agitation, preserve client dignity, prevent dangerous wandering and falls, and master compassionate daily living assistance.",
            'estimated_hours' => 6,
            'thumbnail' => 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
            'icon_name' => 'Brain',
            'is_published' => true,
            'order' => 1,
        ]);

        // Module 1.1
        $mod1_1 = Module::create([
            'course_id' => $course1->id,
            'title' => 'Module 1: Foundations of Cognitive Decline & Behavioral Communication',
            'slug' => 'foundations-cognitive-decline-communication',
            'description' => 'Understand neuropathology differences between Alzheimer’s and other dementias, and master validation therapy over reality orientation.',
            'estimated_minutes' => 60,
            'order' => 1,
            'is_published' => true,
        ]);

        $lesson1_1_1 = Lesson::create([
            'module_id' => $mod1_1->id,
            'title' => "Understanding Alzheimer's vs Vascular & Lewy Body Dementias",
            'slug' => 'understanding-alzheimers-vascular-lewy-body',
            'content_type' => 'text_guide',
            'summary' => 'Distinguish the key diagnostic presentations, progression timelines, and behavioral indicators across major types of dementia.',
            'body' => "### Clinical Overview of Dementia Syndromes

Dementia is not a single disease, but an umbrella term describing a clinical syndrome of cognitive decline severe enough to interfere with daily life and independent functioning.

#### Major Types of Cognitive Impairment:
1. **Alzheimer's Disease (60–80% of cases)**:
   - Characterized by amyloid plaque deposits and tau neurofibrillary tangles.
   - Earliest symptoms: Short-term memory lapses, difficulty learning new routines, spatial disorientation.
   - Progression: Gradual, progressive loss of executive function, language (aphasia), and motor skills.

2. **Vascular Dementia (10–20% of cases)**:
   - Caused by impaired cerebral blood flow (micro-strokes or major stroke events).
   - Progression: Often step-wise rather than smooth linear decline.
   - Characteristic signs: Sudden changes in gait, confusion, executive decision paralysis.

3. **Lewy Body Dementia (LBD)**:
   - Caused by alpha-synuclein protein aggregates in brain neurons.
   - Hallmarks: Visual hallucinations, marked fluctuations in alertness, Parkinsonian tremors and rigidity.

---

### Core Caregiving Principles:
* **Preserve Personhood**: Address the client by their preferred name; never speak about them in the third person in their presence.
* **Non-Confrontational Redirects**: When delusions occur, validate their underlying emotional truth rather than arguing objective facts.
* **Sensory Overload Reduction**: Keep ambient sound, harsh fluorescent lighting, and sudden movements to a minimum during transitions.",
            'duration_minutes' => 20,
            'key_takeaways' => [
                'Alzheimer’s affects short-term episodic memory first, while Lewy Body dementia often features visual hallucinations and motor rigidity.',
                'Never argue with memory errors; meet the client in their current reality.',
                'Environmental adjustments directly reduce anxiety and combat catastrophic reactions.',
            ],
            'clinical_checklist' => [
                'Assess room lighting and minimize casting shadows that may trigger hallucinations',
                'Verify hearing aids and eyeglasses are clean and in proper position before communicating',
                'Speak slowly with a warm, lower pitch and maintain eye level contact',
            ],
            'order' => 1,
            'is_published' => true,
        ]);

        $lesson1_1_2 = Lesson::create([
            'module_id' => $mod1_1->id,
            'title' => 'Compassionate Validation Therapy & De-escalation Techniques',
            'slug' => 'validation-therapy-deescalation-techniques',
            'content_type' => 'protocol',
            'summary' => 'Practical step-by-step techniques to de-escalate anxiety, agitation, and resistance during routine hygiene and meal times.',
            'body' => '### The Validation Approach (Naomi Feil Method)

Validation therapy accepts the reality and emotional expressions of people with cognitive decline. Trying to force a resident back to current reality (known as aggressive reality orientation) causes severe emotional distress, fear, and combative behavior.

#### The 4-Step De-Escalation Protocol:

1. **Acknowledge and Validate Emotion**:
   - *Scenario*: Resident insists, *"I need to go home, my mother is waiting with dinner!"*
   - *Incorrect*: *"Your mother passed away 30 years ago, you live here now."*
   - *Correct*: *"Your mother made wonderful dinners. You must really miss her cooking. Tell me what she used to make on Sunday evenings."*

2. **Rephrase with Empathy**:
   - Match the emotional tone with calm reassurance. Validate feelings of loneliness, duty, or fear.

3. **Use Tangible Anchors**:
   - Provide a warm blanket, a favorite photograph album, or a cup of herbal tea to comfort tactile senses.

4. **Gentle Redirection**:
   - Transition the activity seamlessly: *"While we wait for the bus schedule, could you help me fold these clean towels?"*',
            'duration_minutes' => 20,
            'key_takeaways' => [
                'Validation therapy prioritizes emotional peace over factual accuracy.',
                'Meaningful, repetitive tasks (folding towels, sorting cards) provide purpose and alleviate restless energy.',
                'Always approach from the front; never startle someone living with dementia from behind.',
            ],
            'clinical_checklist' => [
                'Make eye contact at eye level before speaking',
                'Use short, single-step sentences (e.g., "Let\'s sit down" instead of multiple directions)',
                'Observe facial micro-expressions and body posture for early signs of distress',
            ],
            'order' => 2,
            'is_published' => true,
        ]);

        $lesson1_1_3 = Lesson::create([
            'module_id' => $mod1_1->id,
            'title' => 'Managing Sundowning Syndrome & Sleep-Wake Rhythm Disturbance',
            'slug' => 'managing-sundowning-sleep-disturbances',
            'content_type' => 'text_guide',
            'summary' => 'Preventive environmental modifications and non-pharmacological interventions for late afternoon restlessness.',
            'body' => '### Understanding Sundowning

Sundowning is a clinical phenomenon characterized by increased confusion, anxiety, pacing, agitation, and disorientation that begins in late afternoon and continues into the evening.

#### Key Triggers:
- Mental and physical exhaustion accumulated over the day.
- Shadow casting caused by low sun angles and dim lighting.
- Circadian pacemaker (suprachiasmatic nucleus) dysfunction.
- Unmet physical needs: Hunger, thirst, full bladder, constipation, or undiagnosed pain.

#### Best Caregiver Practices:
1. **Morning Light Exposure**: Ensure 30–45 minutes of bright natural light exposure before noon to reinforce circadian rhythm.
2. **Close Blinds at 3:00 PM**: Turn on indoor warm illumination before the sun begins to set to avoid dramatic contrast and confusing shadows.
3. **Calming Afternoon Routine**: Introduce soothing instrumental music, hand massages with lavender lotion, or gentle walking before the typical sundowning window begins.',
            'duration_minutes' => 20,
            'key_takeaways' => [
                'Sundowning is exacerbated by fatigue, changing shadows, and low lighting.',
                'Proactively close curtains and turn on warm lights before dusk.',
                'Check for basic physical causes (dehydration, pain, urinary tract infections) whenever sudden behavioral shifts occur.',
            ],
            'clinical_checklist' => [
                'Check hydration log to ensure adequate fluid intake before 4:00 PM',
                'Draw window shades prior to dusk to eliminate eerie exterior reflections',
                'Engage client in a calming, low-stimulus activity in early afternoon',
            ],
            'order' => 3,
            'is_published' => true,
        ]);

        // Quiz for Module 1.1
        $quiz1_1 = Quiz::create([
            'course_id' => $course1->id,
            'module_id' => $mod1_1->id,
            'title' => 'Competency Exam: Cognitive Communication & De-escalation Mastery',
            'description' => 'Test your understanding of dementia syndromes, validation response techniques, and sundowning mitigation. Passing score is 80%.',
            'passing_score' => 80,
            'time_limit_minutes' => 15,
            'is_published' => true,
        ]);

        $q1 = Question::create([
            'quiz_id' => $quiz1_1->id,
            'question_text' => 'A client with moderate Alzheimer’s disease becomes distressed and says, "I have to leave right now, I need to get my kids from kindergarten!" (Their children are in their 40s). What is the most therapeutically appropriate response?',
            'explanation' => 'Validation therapy connects with the underlying emotion (care for children) and avoids distressing the client by arguing factual age or death.',
            'points' => 20,
            'order' => 1,
        ]);
        QuestionOption::create(['question_id' => $q1->id, 'option_text' => '"Your kids are grown adults in their 40s. Look at this calendar."', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q1->id, 'option_text' => '"You were always such a loving mother. Tell me about your favorite memories of your children when they were small."', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q1->id, 'option_text' => '"You cannot leave because the door is locked for your safety."', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q1->id, 'option_text' => 'Ignore the statement and walk away until they calm down.', 'is_correct' => false, 'order' => 4]);

        $q2 = Question::create([
            'quiz_id' => $quiz1_1->id,
            'question_text' => 'Which clinical characteristic is most specifically associated with Lewy Body Dementia compared to typical Alzheimer’s disease?',
            'explanation' => 'Visual hallucinations, fluctuating levels of alertness, and Parkinsonian motor symptoms are classic features of Lewy Body Dementia.',
            'points' => 20,
            'order' => 2,
        ]);
        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'Sudden episodic hearing loss only in the left ear.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'Visual hallucinations, marked alertness fluctuations, and Parkinsonian motor tremors.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'Complete memory recovery after 6 months.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q2->id, 'option_text' => 'Rapid enlargement of the optic nerve.', 'is_correct' => false, 'order' => 4]);

        $q3 = Question::create([
            'quiz_id' => $quiz1_1->id,
            'question_text' => 'What is an effective non-pharmacological strategy to minimize late afternoon sundowning symptoms in home care?',
            'explanation' => 'Drawing shades and illuminating rooms before dusk prevents confusing shadows, and morning sunlight helps align circadian rhythm.',
            'points' => 20,
            'order' => 3,
        ]);
        QuestionOption::create(['question_id' => $q3->id, 'option_text' => 'Turn off all indoor lighting so the resident goes to sleep immediately at 4 PM.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q3->id, 'option_text' => 'Close window blinds and turn on warm interior lights before dusk to avoid confusing shadows.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q3->id, 'option_text' => 'Give high doses of caffeinated drinks in the evening.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q3->id, 'option_text' => 'Instruct the family to challenge the resident with complex math quizzes.', 'is_correct' => false, 'order' => 4]);

        $q4 = Question::create([
            'quiz_id' => $quiz1_1->id,
            'question_text' => 'When approaching a person living with dementia who is seated, what is the best physical approach to build trust and avoid triggering panic?',
            'explanation' => 'Approaching from the front at eye level respects the narrowed peripheral field of vision common in dementia and prevents startle reflexes.',
            'points' => 20,
            'order' => 4,
        ]);
        QuestionOption::create(['question_id' => $q4->id, 'option_text' => 'Approach directly from behind and place hands on their shoulders.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q4->id, 'option_text' => 'Approach slowly from the front, smile, make eye contact, and lower yourself to their eye level.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q4->id, 'option_text' => 'Stand tall directly over them and speak loudly in a high pitch.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q4->id, 'option_text' => 'Run toward them with rapid hand gestures.', 'is_correct' => false, 'order' => 4]);

        $q5 = Question::create([
            'quiz_id' => $quiz1_1->id,
            'question_text' => 'If a client with dementia suddenly demonstrates an abrupt, acute surge in confusion, combativeness, or delirium within 24 hours, what should the caregiver immediately suspect?',
            'explanation' => 'Acute delirium in elderly clients is very frequently caused by an underlying infection (such as a Urinary Tract Infection), acute pain, or medication adverse interaction.',
            'points' => 20,
            'order' => 5,
        ]);
        QuestionOption::create(['question_id' => $q5->id, 'option_text' => 'Normal progression of dementia that requires no medical review.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q5->id, 'option_text' => 'A secondary medical issue such as a Urinary Tract Infection (UTI), acute pain, or dehydration.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q5->id, 'option_text' => 'The client is purposely behaving poorly to test the caregiver.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q5->id, 'option_text' => 'Instant spontaneous memory recovery.', 'is_correct' => false, 'order' => 4]);

        // Module 1.2
        $mod1_2 = Module::create([
            'course_id' => $course1->id,
            'title' => 'Module 2: Daily Living Assistance, Mobility & Fall Prevention',
            'slug' => 'daily-living-mobility-fall-prevention',
            'description' => 'Safe transfer mechanics, gait belt usage, bathroom safety modifications, and dysphagia meal support.',
            'estimated_minutes' => 60,
            'order' => 2,
            'is_published' => true,
        ]);

        $lesson1_2_1 = Lesson::create([
            'module_id' => $mod1_2->id,
            'title' => 'Safe Patient Transfers & Ergonomic Gait Belt Utilization',
            'slug' => 'safe-patient-transfers-gait-belt-utilization',
            'content_type' => 'checklist',
            'summary' => 'Step-by-step procedures for bed-to-wheelchair transfers, body mechanics to protect both caregiver and client.',
            'body' => "### Ergonomic Transfer Protocols

Falls during sit-to-stand and pivot transfers represent one of the highest risk hazards in home care. Practicing correct ergonomic posture protects both client and caregiver from catastrophic injuries.

#### 6-Step Bed-to-Chair Transfer Sequence:

1. **Prepare Environment**: Position wheelchair at a 45-degree angle to the bed on the client's stronger side. Lock both wheelchair wheel brakes.
2. **Apply Gait Belt**: Secure belt snugly around client's natural waistline over clothing. Insert two fingers under belt to ensure appropriate snugness.
3. **Proper Footwear**: Ensure non-skid socks or supportive shoes are on client's feet before standing.
4. **Caregiver Stance**: Keep feet shoulder-width apart with bent knees; lift with quadriceps and glutes, never your lumbar spine.
5. **Rock and Count**: Rock three times to generate momentum (*\"1, 2, 3... stand\"*).
6. **Pivot and Lower**: Pivot together smoothly until back of client's legs touch chair seat; gently lower client into chair.",
            'duration_minutes' => 20,
            'key_takeaways' => [
                'Always lock wheelchair brakes prior to any transfer attempt.',
                'Use a gait belt; never pull or lift a client by their armpits or shoulders (prevents dislocation).',
                'Transfer toward the client’s stronger side whenever possible.',
            ],
            'clinical_checklist' => [
                'Ensure non-skid footwear is on client',
                'Lock all brakes on wheelchair or commode',
                'Verify gait belt fits with two-finger clearance',
                'Clear all rugs, cords, and obstacles from transfer path',
            ],
            'order' => 1,
            'is_published' => true,
        ]);

        $lesson1_2_2 = Lesson::create([
            'module_id' => $mod1_2->id,
            'title' => 'Dysphagia Precautions & Safe Mealtime Nutrition',
            'slug' => 'dysphagia-precautions-safe-mealtime-nutrition',
            'content_type' => 'text_guide',
            'summary' => 'Recognizing swallowing difficulties, modified diet textures, and upright positioning to avoid aspiration pneumonia.',
            'body' => "### Dysphagia and Aspiration Risk

Dysphagia (difficulty swallowing) is common in late-stage dementia, stroke recovery, and neuromuscular disorders. Food or liquid entering the airway can lead to silent aspiration and life-threatening pneumonia.

#### Signs of Swallowing Distress:
- Coughing or throat clearing during or immediately after swallows.
- \"Wet\" or gurgly vocal quality following liquid intake.
- Pocketing food in cheeks without swallowing.
- Watery eyes, grimacing, or prolonged chewing.

#### Safe Feeding Principles:
- **High Fowler's Position**: Sit client upright at a 90-degree angle during meals and maintain this position for at least 30–45 minutes post-meal.
- **Chin-Tuck Maneuver**: Instruct or assist client to tilt chin slightly downward toward chest when swallowing, which narrows the airway entrance.
- **Small Bites & Sips**: Provide small teaspoon portions and do not rush pace.",
            'duration_minutes' => 20,
            'key_takeaways' => [
                'Keep client seated upright at 90 degrees during and 30 minutes after eating.',
                'A wet voice after drinking is a classic warning sign of micro-aspiration.',
                'Follow speech-language pathologist prescribed diet texture (pureed, minced, nectar-thick liquids).',
            ],
            'clinical_checklist' => [
                'Check client position is fully upright (90 degrees)',
                'Ensure oral cavity is clear of pocketed food at end of meal',
                'Maintain calm, undistracted dining atmosphere',
            ],
            'order' => 2,
            'is_published' => true,
        ]);

        // Quiz for Module 1.2
        $quiz1_2 = Quiz::create([
            'course_id' => $course1->id,
            'module_id' => $mod1_2->id,
            'title' => 'Final Certification Exam: Mobility Safety & Dysphagia Clinical Protocols',
            'description' => 'Complete this comprehensive exam to receive your official CADCS credential. 80% or higher required.',
            'passing_score' => 80,
            'time_limit_minutes' => 15,
            'is_published' => true,
        ]);

        $q2_1 = Question::create([
            'quiz_id' => $quiz1_2->id,
            'question_text' => 'When assisting a client from a bed to a wheelchair, why is lifting the client by their armpits or underarms strictly prohibited?',
            'explanation' => 'Lifting under the armpits risks severe brachial plexus nerve damage and shoulder subluxation or dislocation. A gait belt around the waist must always be used.',
            'points' => 25,
            'order' => 1,
        ]);
        QuestionOption::create(['question_id' => $q2_1->id, 'option_text' => 'Because it is uncomfortable for the caregiver\'s hands only.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q2_1->id, 'option_text' => 'It can cause severe brachial plexus nerve injury and shoulder joint dislocation.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q2_1->id, 'option_text' => 'Because it takes too much time.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q2_1->id, 'option_text' => 'There is no prohibition against lifting by the armpits.', 'is_correct' => false, 'order' => 4]);

        $q2_2 = Question::create([
            'quiz_id' => $quiz1_2->id,
            'question_text' => 'How long should a client with known dysphagia remain seated upright (90 degrees) after finishing their meal to prevent aspiration pneumonia?',
            'explanation' => 'Remaining upright for 30 to 45 minutes allows gravity to assist digestion and prevents esophageal reflux/aspiration.',
            'points' => 25,
            'order' => 2,
        ]);
        QuestionOption::create(['question_id' => $q2_2->id, 'option_text' => 'They should lay flat immediately to rest.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q2_2->id, 'option_text' => 'At least 30 to 45 minutes post-meal.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q2_2->id, 'option_text' => 'Exactly 2 minutes.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q2_2->id, 'option_text' => 'Overnight without moving.', 'is_correct' => false, 'order' => 4]);

        $q2_3 = Question::create([
            'quiz_id' => $quiz1_2->id,
            'question_text' => 'What is the "chin-tuck" maneuver and why is it recommended for clients experiencing mild swallowing difficulty?',
            'explanation' => 'Tucking the chin downward towards the chest widens the valleculae and closes the airway passage, directing food safely into the esophagus.',
            'points' => 25,
            'order' => 3,
        ]);
        QuestionOption::create(['question_id' => $q2_3->id, 'option_text' => 'Tilting head backward towards ceiling to let liquid drop faster.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q2_3->id, 'option_text' => 'Tilting the chin down toward chest during swallow to protect the airway.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q2_3->id, 'option_text' => 'Rotating head in full 360 degree circles while chewing.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q2_3->id, 'option_text' => 'Holding your breath for two full minutes.', 'is_correct' => false, 'order' => 4]);

        $q2_4 = Question::create([
            'quiz_id' => $quiz1_2->id,
            'question_text' => 'What is the first step before performing a sit-to-stand transfer using a wheelchair?',
            'explanation' => 'Always engage both wheel brakes and ensure footrests are folded back or swung away before initiating transfer.',
            'points' => 25,
            'order' => 4,
        ]);
        QuestionOption::create(['question_id' => $q2_4->id, 'option_text' => 'Lock both wheelchair wheel brakes and swing footrests clear.', 'is_correct' => true, 'order' => 1]);
        QuestionOption::create(['question_id' => $q2_4->id, 'option_text' => 'Pull the resident up quickly by their shirt collar.', 'is_correct' => false, 'order' => 2]);
        QuestionOption::create(['question_id' => $q2_4->id, 'option_text' => 'Roll the wheelchair backwards down a hallway.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q2_4->id, 'option_text' => 'Leave the brakes unlocked so the chair can move freely.', 'is_correct' => false, 'order' => 4]);

        // COURSE 2: Elderly Home Health & Vital Signs Clinical Aide
        $course2 = Course::create([
            'title' => 'Professional Home Health Aide & Vital Signs Monitoring (EHCA)',
            'slug' => 'home-health-aide-vital-signs-monitoring',
            'badge_title' => 'EHCA Clinical Credential',
            'category' => 'Elderly Home Care',
            'level' => 'Beginner to Intermediate',
            'summary' => 'Master precise vital signs measurement, infection barrier precautions, medication assistance rules, and rapid stroke/sepsis recognition.',
            'description' => 'Home health aides form the frontline of preventative healthcare. Learn how to accurately monitor vital trends (BP, pulse, SpO2, temp), recognize subtle red flags that require immediate emergency triage, and maintain strict infection control protocols in personal home settings.',
            'estimated_hours' => 5,
            'thumbnail' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
            'icon_name' => 'Activity',
            'is_published' => true,
            'order' => 2,
        ]);

        $mod2_1 = Module::create([
            'course_id' => $course2->id,
            'title' => 'Module 1: Vital Signs Clinical Assessment & Emergency Red Flags',
            'slug' => 'vital-signs-assessment-emergency-red-flags',
            'description' => 'Blood pressure norms, pulse oximetry accuracy, respiration counting, and the FAST stroke recognition standard.',
            'estimated_minutes' => 45,
            'order' => 1,
            'is_published' => true,
        ]);

        $lesson2_1_1 = Lesson::create([
            'module_id' => $mod2_1->id,
            'title' => 'Accurate Vital Signs: Blood Pressure, Pulse, SpO2 & Temperature',
            'slug' => 'accurate-vital-signs-bp-pulse-spo2',
            'content_type' => 'text_guide',
            'summary' => 'Clinical norms, cuff sizing rules, resting periods, and documenting vital trends over time.',
            'body' => '### Standard Clinical Norms (Adults / Geriatrics)

- **Blood Pressure**: Normal < 120/80 mmHg. Hypertensive Crisis: Systolic > 180 or Diastolic > 120 (Immediate 911/Clinical escalation).
- **Heart Rate (Pulse)**: 60–100 beats per minute at rest.
- **Respiration**: 12–20 breaths per minute. (Count covertly while pretending to check pulse to prevent conscious breathing alteration).
- **Pulse Oximetry (SpO2)**: 95%–100% on room air. (Chronic COPD targets may be 88%–92% as designated by physician).
- **Body Temperature**: Oral 97.8°F–99.1°F (36.5°C–37.3°C).',
            'duration_minutes' => 20,
            'key_takeaways' => [
                'Client should rest for 5 minutes quietly before blood pressure measurement.',
                'Use correct cuff size: Bladder should encircle 80% of upper arm circumference.',
                'Do not announce you are counting respirations to prevent client from changing breathing rate.',
            ],
            'clinical_checklist' => [
                'Ensure client has not consumed caffeine or smoked within 30 minutes prior to vitals',
                'Position arm at heart level with palm facing upward',
                'Record all readings with date, time, and patient position (sitting vs lying)',
            ],
            'order' => 1,
            'is_published' => true,
        ]);

        $lesson2_1_2 = Lesson::create([
            'module_id' => $mod2_1->id,
            'title' => 'Rapid Stroke Recognition (BE-FAST) and Sepsis Screening',
            'slug' => 'rapid-stroke-recognition-sepsis-screening',
            'content_type' => 'protocol',
            'summary' => 'Time-sensitive emergency identification protocols that save brain tissue and prevent septic shock.',
            'body' => '### The BE-FAST Stroke Protocol

"Time is Brain." Over 1.9 million brain cells die every minute a major stroke remains untreated.

- **B (Balance)**: Sudden loss of balance, dizziness, or ataxia.
- **E (Eyes)**: Sudden loss of vision in one or both eyes or double vision.
- **F (Face)**: Uneven smile, facial droop on one side.
- **A (Arms)**: Arm weakness; one arm drifts downward when both are raised for 10 seconds.
- **S (Speech)**: Slurred speech, word-finding difficulty, inability to repeat simple phrases.
- **T (Time)**: Call Emergency Medical Services (911) immediately; note exact time symptoms were last known normal.',
            'duration_minutes' => 25,
            'key_takeaways' => [
                'Note the exact time symptoms first began — this dictates eligibility for clot-busting tPA medications.',
                'Never give aspirin or food/water to a suspected stroke victim before ER arrival.',
                'Sepsis triad: Confusion/shivering, high or low temp, rapid pulse (>90) and breathing (>20).',
            ],
            'clinical_checklist' => [
                'Ask client to smile and check for symmetrical facial movement',
                'Have client hold both arms straight out with eyes closed for 10 seconds',
                'Ask client to repeat a simple sentence: "The sky is blue today in Chicago"',
            ],
            'order' => 2,
            'is_published' => true,
        ]);

        // Quiz for Module 2.1
        $quiz2_1 = Quiz::create([
            'course_id' => $course2->id,
            'module_id' => $mod2_1->id,
            'title' => 'Clinical Vitals & Emergency Protocol Assessment',
            'description' => 'Test your proficiency in vital sign interpretation and stroke triage.',
            'passing_score' => 80,
            'time_limit_minutes' => 15,
            'is_published' => true,
        ]);

        $q3_1 = Question::create([
            'quiz_id' => $quiz2_1->id,
            'question_text' => 'In the BE-FAST stroke recognition protocol, what does the "A" stand for and how should the caregiver test it?',
            'explanation' => 'Arm weakness is tested by having the individual raise both arms forward for 10 seconds to observe for one-sided downward drift.',
            'points' => 34,
            'order' => 1,
        ]);
        QuestionOption::create(['question_id' => $q3_1->id, 'option_text' => 'Appetite check (feed them soup)', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q3_1->id, 'option_text' => 'Arm weakness (ask client to extend both arms forward and check for drift)', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q3_1->id, 'option_text' => 'Ankle mobility check', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q3_1->id, 'option_text' => 'Altitude adjustment', 'is_correct' => false, 'order' => 4]);

        $q3_2 = Question::create([
            'quiz_id' => $quiz2_1->id,
            'question_text' => 'Why should a caregiver avoid announcing "I am now going to count your breaths per minute" when checking respiration?',
            'explanation' => 'When people know their breathing is being counted, they involuntarily adjust their rhythm, depth, or speed.',
            'points' => 33,
            'order' => 2,
        ]);
        QuestionOption::create(['question_id' => $q3_2->id, 'option_text' => 'Because clients will unconsciously alter their natural respiratory rate.', 'is_correct' => true, 'order' => 1]);
        QuestionOption::create(['question_id' => $q3_2->id, 'option_text' => 'Because counting respirations is illegal.', 'is_correct' => false, 'order' => 2]);
        QuestionOption::create(['question_id' => $q3_2->id, 'option_text' => 'It causes immediate vocal cord paralysis.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q3_2->id, 'option_text' => 'It has no effect whatsoever.', 'is_correct' => false, 'order' => 4]);

        $q3_3 = Question::create([
            'quiz_id' => $quiz2_1->id,
            'question_text' => 'A resting client presents with a blood pressure of 192/118 mmHg with a sudden throbbing headache and blurred vision. What is the immediate priority?',
            'explanation' => 'A BP over 180/120 with symptomatic neurological signs indicates a Hypertensive Emergency requiring immediate 911 activation.',
            'points' => 33,
            'order' => 3,
        ]);
        QuestionOption::create(['question_id' => $q3_3->id, 'option_text' => 'Advise them to go on a brisk 3-mile jog.', 'is_correct' => false, 'order' => 1]);
        QuestionOption::create(['question_id' => $q3_3->id, 'option_text' => 'Treat as Hypertensive Crisis: Notify 911 emergency services immediately and keep client calm.', 'is_correct' => true, 'order' => 2]);
        QuestionOption::create(['question_id' => $q3_3->id, 'option_text' => 'Wait 48 hours to recheck BP before telling anyone.', 'is_correct' => false, 'order' => 3]);
        QuestionOption::create(['question_id' => $q3_3->id, 'option_text' => 'Give three cups of salted broth.', 'is_correct' => false, 'order' => 4]);

        // COURSE 3: Pediatric & Special Needs Support
        $course3 = Course::create([
            'title' => 'Pediatric Neurodiversity & Sensory Support (PSNC)',
            'slug' => 'pediatric-neurodiversity-sensory-support',
            'badge_title' => 'PSNC Pediatric Credential',
            'category' => 'Pediatric & Special Needs',
            'level' => 'Intermediate',
            'summary' => 'Support children with Autism Spectrum Disorder (ASD), sensory integration challenges, non-verbal communication aids, and positive behavioral routines.',
            'description' => 'Children with developmental differences thrive when provided structured, predictable, and sensory-attuned environments. This course prepares caregivers and aides with positive reinforcement methodologies, visual schedule deployment, and sensory calming strategies.',
            'estimated_hours' => 4,
            'thumbnail' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
            'icon_name' => 'HeartHandshake',
            'is_published' => true,
            'order' => 3,
        ]);

        $mod3_1 = Module::create([
            'course_id' => $course3->id,
            'title' => 'Module 1: Sensory Integration & Positive Behavior Routines',
            'slug' => 'sensory-integration-positive-behavior-routines',
            'description' => 'Sensory processing differences, visual communication schedules, and reducing meltdowns through environmental adaptation.',
            'estimated_minutes' => 45,
            'order' => 1,
            'is_published' => true,
        ]);

        $lesson3_1_1 = Lesson::create([
            'module_id' => $mod3_1->id,
            'title' => 'Sensory Overload vs Tantrum & Calming De-escalation',
            'slug' => 'sensory-overload-vs-tantrum-deescalation',
            'content_type' => 'text_guide',
            'summary' => 'Understanding neurobiological sensory meltdowns and how to implement sensory diet strategies effectively.',
            'body' => '### Meltdown vs Tantrum: Critical Distinction

A **tantrum** is goal-directed (to gain attention, an item, or avoid an activity). The child monitors adult reactions and can modulate behavior if their goal is reached.

A **sensory meltdown** is an involuntary fight-or-flight neurological reaction to sensory overload (auditory, visual, tactile, or vestibular). The child has lost executive control and cannot voluntarily stop without sensory de-escalation.',
            'duration_minutes' => 20,
            'key_takeaways' => [
                'Sensory meltdowns cannot be punished away; reduce auditory and visual stimulation immediately.',
                'Provide deep pressure therapy (weighted blankets, compression vests) if preferred by the child.',
                'Maintain a calm, quiet tone and create safe physical space.',
            ],
            'clinical_checklist' => [
                'Reduce overhead fluorescent lights and loud noises',
                'Offer noise-canceling headphones in public or noisy settings',
                'Utilize visual countdown timers before transition periods',
            ],
            'order' => 1,
            'is_published' => true,
        ]);

        $quiz3_1 = Quiz::create([
            'course_id' => $course3->id,
            'module_id' => $mod3_1->id,
            'title' => 'Pediatric Sensory & Behavior Competency Exam',
            'description' => 'Test your knowledge on sensory regulation and pediatric care support.',
            'passing_score' => 80,
            'time_limit_minutes' => 15,
            'is_published' => true,
        ]);

        $q4_1 = Question::create([
            'quiz_id' => $quiz3_1->id,
            'question_text' => 'What is the primary difference between a goal-directed tantrum and a sensory meltdown in a child with ASD?',
            'explanation' => 'A meltdown is an involuntary neurological reaction to sensory overload where the child has lost emotional control and is not seeking a social reward.',
            'points' => 50,
            'order' => 1,
        ]);
        QuestionOption::create(['question_id' => $q4_1->id, 'option_text' => 'A meltdown is an involuntary neurological overload response, whereas a tantrum is goal-directed.', 'is_correct' => true, 'order' => 1]);
        QuestionOption::create(['question_id' => $q4_1->id, 'option_text' => 'There is no difference; both require immediate time-out isolation.', 'is_correct' => false, 'order' => 2]);

        $q4_2 = Question::create([
            'quiz_id' => $quiz3_1->id,
            'question_text' => 'Why are visual activity schedules and visual countdown timers highly beneficial for individuals with sensory processing differences?',
            'explanation' => 'Visual schedules reduce anxiety by providing clear predictability for activity transitions.',
            'points' => 50,
            'order' => 2,
        ]);
        QuestionOption::create(['question_id' => $q4_2->id, 'option_text' => 'They eliminate anxiety by providing clear predictability before routine transitions.', 'is_correct' => true, 'order' => 1]);
        QuestionOption::create(['question_id' => $q4_2->id, 'option_text' => 'They make the child do more homework without sleeping.', 'is_correct' => false, 'order' => 2]);

        // COURSE 4: First Aid & CPR
        $course4 = Course::create([
            'title' => 'Emergency First Aid, Choking & Life-Safety Response (FACR)',
            'slug' => 'emergency-first-aid-cpr-life-safety',
            'badge_title' => 'FACR Life-Safety Credential',
            'category' => 'Emergency & Safety',
            'level' => 'All Levels',
            'summary' => 'Critical emergency intervention protocols for choking relief (Heimlich), high-quality CPR, AED utilization, burn care, and hemorrhage control.',
            'description' => 'Immediate, decisive action during medical emergencies can mean the difference between life and death. This course provides comprehensive, hands-on step-by-step guidance for airway obstruction, cardiac arrest, wound management, and calling 911 effectively.',
            'estimated_hours' => 3,
            'thumbnail' => 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
            'icon_name' => 'ShieldAlert',
            'is_published' => true,
            'order' => 4,
        ]);

        $mod4_1 = Module::create([
            'course_id' => $course4->id,
            'title' => 'Module 1: High-Quality CPR & Airway Management',
            'slug' => 'cpr-airway-management-emergency',
            'description' => 'Chest compression depth/rate, AED pad placement, and relief of severe foreign-body airway obstruction.',
            'estimated_minutes' => 30,
            'order' => 1,
            'is_published' => true,
        ]);

        $lesson4_1_1 = Lesson::create([
            'module_id' => $mod4_1->id,
            'title' => 'Adult Choking Relief (Abdominal Thrusts / Heimlich Maneuver)',
            'slug' => 'adult-choking-relief-heimlich',
            'content_type' => 'protocol',
            'summary' => 'Recognizing universal choking sign and executing rapid upward abdominal thrusts.',
            'body' => "### Universal Choking Sign & Immediate Action

When an airway is completely blocked, the victim cannot speak, cough forcefully, or breathe.

1. **Ask**: *\"Are you choking? Can you speak?\"* If they nod yes and cannot make sound, activate emergency protocols.
2. **Positioning**: Stand firmly behind the person with one foot between their feet for stability.
3. **Fist Placement**: Make a fist with one hand and place the thumb side just above the client's navel and well below the xiphoid process.
4. **Thrusts**: Grasp fist with your other hand and deliver quick, inward and upward thrusts until object is expelled or person becomes unresponsive.",
            'duration_minutes' => 15,
            'key_takeaways' => [
                'Deliver quick inward and upward thrusts above the navel.',
                'If the person becomes unconscious, lower them gently to the floor and begin CPR with chest compressions.',
                'Inspect the airway before rescue breaths only if a visible object can be easily swept.',
            ],
            'clinical_checklist' => [
                'Confirm complete airway obstruction (inability to speak or cough)',
                'Position fist between navel and ribcage',
                'Deliver distinct upward thrusts',
            ],
            'order' => 1,
            'is_published' => true,
        ]);

        // 3. Create Enrollments, Progress, and Certificates for demo users
        // Maya Lin (caregiver@caregiver.test) progress in Course 1:
        $enrollment1 = Enrollment::create([
            'user_id' => $caregiver1->id,
            'course_id' => $course1->id,
            'status' => 'in_progress',
            'progress_percentage' => 60,
            'enrolled_at' => Carbon::now()->subDays(5),
        ]);

        // Lessons completed by Maya Lin
        LessonProgress::create([
            'user_id' => $caregiver1->id,
            'lesson_id' => $lesson1_1_1->id,
            'status' => 'completed',
            'completed_at' => Carbon::now()->subDays(4),
        ]);
        LessonProgress::create([
            'user_id' => $caregiver1->id,
            'lesson_id' => $lesson1_1_2->id,
            'status' => 'completed',
            'completed_at' => Carbon::now()->subDays(3),
        ]);
        LessonProgress::create([
            'user_id' => $caregiver1->id,
            'lesson_id' => $lesson1_1_3->id,
            'status' => 'completed',
            'completed_at' => Carbon::now()->subDays(2),
        ]);

        // Maya Lin passed Quiz 1.1 with 100%!
        $attempt1 = QuizAttempt::create([
            'user_id' => $caregiver1->id,
            'quiz_id' => $quiz1_1->id,
            'score' => 100,
            'max_score' => 100,
            'percentage' => 100.00,
            'passed' => true,
            'user_answers' => [
                $q1->id => $q1->options()->where('is_correct', true)->first()?->id,
                $q2->id => $q2->options()->where('is_correct', true)->first()?->id,
                $q3->id => $q3->options()->where('is_correct', true)->first()?->id,
                $q4->id => $q4->options()->where('is_correct', true)->first()?->id,
                $q5->id => $q5->options()->where('is_correct', true)->first()?->id,
            ],
            'started_at' => Carbon::now()->subDays(2)->subMinutes(12),
            'completed_at' => Carbon::now()->subDays(2),
        ]);

        // Sarah Jenkins completed Course 1 entirely and earned Certificate!
        $enrollment2 = Enrollment::create([
            'user_id' => $caregiver2->id,
            'course_id' => $course1->id,
            'status' => 'completed',
            'progress_percentage' => 100,
            'enrolled_at' => Carbon::now()->subDays(20),
            'completed_at' => Carbon::now()->subDays(2),
        ]);

        foreach ([$lesson1_1_1, $lesson1_1_2, $lesson1_1_3, $lesson1_2_1, $lesson1_2_2] as $les) {
            LessonProgress::firstOrCreate([
                'user_id' => $caregiver2->id,
                'lesson_id' => $les->id,
            ], [
                'status' => 'completed',
                'completed_at' => Carbon::now()->subDays(5),
            ]);
        }

        $attempt2_1 = QuizAttempt::create([
            'user_id' => $caregiver2->id,
            'quiz_id' => $quiz1_1->id,
            'score' => 100,
            'max_score' => 100,
            'percentage' => 100.00,
            'passed' => true,
            'user_answers' => [],
            'started_at' => Carbon::now()->subDays(10)->subMinutes(10),
            'completed_at' => Carbon::now()->subDays(10),
        ]);

        $attempt2_2 = QuizAttempt::create([
            'user_id' => $caregiver2->id,
            'quiz_id' => $quiz1_2->id,
            'score' => 100,
            'max_score' => 100,
            'percentage' => 100.00,
            'passed' => true,
            'user_answers' => [],
            'started_at' => Carbon::now()->subDays(2)->subMinutes(14),
            'completed_at' => Carbon::now()->subDays(2),
        ]);

        $certNumber = 'CERT-CADCS-2026-8942';
        $certHash = Str::uuid()->toString();
        Certificate::create([
            'user_id' => $caregiver2->id,
            'course_id' => $course1->id,
            'module_id' => null,
            'certificate_number' => $certNumber,
            'title' => "Certified Dementia & Alzheimer's Care Specialist (CADCS)",
            'recipient_name' => $caregiver2->name,
            'grade_percentage' => 100.00,
            'verification_hash' => $certHash,
            'issued_at' => Carbon::now()->subDays(2),
            'expires_at' => Carbon::now()->addYears(2),
        ]);

        // 4. Seed Activity Logs for rich admin analytics
        $logs = [
            [
                'user_id' => $admin->id,
                'event_type' => 'auth.login',
                'description' => "Administrator {$admin->name} logged in to Clinical CMS console.",
                'properties' => ['role' => 'admin', 'browser' => 'Chrome on MacOS'],
                'created_at' => Carbon::now()->subHours(2),
            ],
            [
                'user_id' => $caregiver2->id,
                'event_type' => 'certificate.issued',
                'description' => "Official Certificate {$certNumber} issued to {$caregiver2->name} for CADCS track completion.",
                'properties' => ['course_title' => $course1->title, 'grade' => 100.0, 'certificate_code' => $certNumber],
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $caregiver2->id,
                'event_type' => 'quiz.submitted',
                'description' => "Caregiver {$caregiver2->name} passed final exam '{$quiz1_2->title}' with score 100%.",
                'properties' => ['quiz_title' => $quiz1_2->title, 'score' => 100, 'passed' => true],
                'created_at' => Carbon::now()->subDays(2)->subMinutes(5),
            ],
            [
                'user_id' => $caregiver1->id,
                'event_type' => 'quiz.submitted',
                'description' => "Caregiver {$caregiver1->name} passed quiz '{$quiz1_1->title}' with score 100%.",
                'properties' => ['quiz_title' => $quiz1_1->title, 'score' => 100, 'passed' => true],
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $caregiver1->id,
                'event_type' => 'lesson.completed',
                'description' => "Caregiver {$caregiver1->name} completed lesson '{$lesson1_1_3->title}'.",
                'properties' => ['lesson_title' => $lesson1_1_3->title, 'module_id' => $mod1_1->id],
                'created_at' => Carbon::now()->subDays(2)->subHours(1),
            ],
            [
                'user_id' => $caregiver1->id,
                'event_type' => 'course.enrolled',
                'description' => "Caregiver {$caregiver1->name} enrolled in '{$course1->title}'.",
                'properties' => ['course_id' => $course1->id, 'category' => $course1->category],
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'user_id' => $caregiver3->id,
                'event_type' => 'auth.register',
                'description' => "New caregiver account registered: {$caregiver3->name} ({$caregiver3->email}).",
                'properties' => ['specialization' => $caregiver3->specialization],
                'created_at' => Carbon::now()->subDays(1),
            ],
            [
                'user_id' => $admin->id,
                'event_type' => 'admin.content_updated',
                'description' => "Administrator updated curriculum guidelines for '{$course2->title}'.",
                'properties' => ['course_id' => $course2->id, 'action' => 'published_module'],
                'created_at' => Carbon::now()->subDays(3),
            ],
        ];

        foreach ($logs as $logData) {
            ActivityLog::create([
                'user_id' => $logData['user_id'],
                'event_type' => $logData['event_type'],
                'description' => $logData['description'],
                'properties' => $logData['properties'],
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'created_at' => $logData['created_at'],
            ]);
        }
    }
}
