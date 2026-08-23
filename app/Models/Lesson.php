<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $module_id
 * @property string $title
 * @property string $slug
 * @property string $content_type
 * @property string|null $summary
 * @property string|null $body
 * @property string|null $video_url
 * @property string|null $audio_url
 * @property int $duration_minutes
 * @property array<string>|null $key_takeaways
 * @property array<string>|null $clinical_checklist
 * @property int $order
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Lesson extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'module_id',
        'title',
        'slug',
        'content_type',
        'summary',
        'body',
        'video_url',
        'audio_url',
        'duration_minutes',
        'key_takeaways',
        'clinical_checklist',
        'order',
        'is_published',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'duration_minutes' => 'integer',
            'order' => 'integer',
            'key_takeaways' => 'array',
            'clinical_checklist' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Module, $this>
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * @return HasMany<LessonProgress, $this>
     */
    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }
}
