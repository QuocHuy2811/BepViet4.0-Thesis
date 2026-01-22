<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    public $timestamps = false;


    protected $table = 'recipes';

    protected $guarded = [];
    //Nguyen Kien Duy
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'recipe_tags', 'recipe_id', 'tag_id');
    }

    // Local Scope: Giúp tái sử dụng logic tìm kiếm ở nhiều nơi
    public function scopeSearch($query, $searchTerm)
    {
        return $query->when($searchTerm, function ($s) use ($searchTerm) {
            $s->where(function ($s) use ($searchTerm) {
                $s->where('title', 'LIKE', "%{$searchTerm}%");
            });
        });
    }

    //Bo loc theo nhieu tieu chi
    public function scopeFilters($query, $filters)
    {
        return $query->when(!empty($filters['region']), function ($q) use ($filters) {
            $q->whereIn('region', (array)$filters['region']);
        })
            ->when(!empty($filters['difficult']), function ($q) use ($filters) {
                $q->whereIn('difficult', (array)$filters['difficult']);
            })
            ->when(!empty($filters['category_id']), function ($q) use ($filters) {
                $q->whereIn('category_id', (array)$filters['category_id']);
            })
            ->when(!empty($filters['time_range']), function ($q) use ($filters) {
                $q->where(function ($sub) use ($filters) {
                    foreach ((array)$filters['time_range'] as $range) {
                        if ($range === 'fast') $sub->orWhere('cook_time', '<=', 30);
                        if ($range === 'medium') $sub->orWhereBetween('cook_time', [31, 60]);
                        if ($range === 'slow') $sub->orWhere('cook_time', '>', 60);
                    }
                });
            });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    //Nguyen Kien Duy 21/01/2026
    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }
    public function getImgPathAttribute($value)
    {
        if ($value == "null") {
            return asset("image/no_img.jpg");
        } else {
            return asset("storage/" . $value);
        }
    }
    public function steps()
    {
        return $this->hasMany(Step::class);
    }
}
