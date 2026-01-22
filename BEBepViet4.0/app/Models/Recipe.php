<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    //Phan Lac An 22/01/2026
    public function xoaHoanToanCongThuc()
    {
        return DB::transaction(function () {
            $this->ingredients()->delete(); 
            $this->steps()->delete();

            if ($this->ratings()) {
                $this->ratings()->delete();
            }
            //Xóa các mối quan hệ nhiều-nhiều (BelongsToMany)
            $this->tags()->detach();

            DB::table('recipe_cookbooks')->where('recipe_id', $this->id)->delete();

            return $this->delete();
        });
    }

    //Phan Lac An 22/01/2026
    public function updateRecipe($data, $file = null)
    {
        return DB::transaction(function () use ($data, $file) {
            //Xử lý ảnh nếu có upload mới
            if ($file) {
                $data['img_path'] = $file->store('recipes', 'public');
            }

            $recipeData = collect($data)->except(['ingredients', 'steps'])->toArray();
            $this->update($recipeData);

            //Xử lý cập nhật Nguyên liệu
            if (isset($data['ingredients'])) {
                // Giải mã chuỗi JSON từ Frontend thành mảng PHP
                $ingredientsArr = is_string($data['ingredients']) 
                    ? json_decode($data['ingredients'], true) 
                    : $data['ingredients'];

                if (is_array($ingredientsArr)) {
                    $this->ingredients()->delete();
                    $this->ingredients()->createMany($ingredientsArr);
                }
            }

            //Xử lý cập nhật Các bước (Steps)
            if (isset($data['steps'])) {
                $this->steps()->delete();
                
                // Xử lý dữ liệu steps trước khi insert
                $stepsArr = is_string($data['steps']) ? json_decode($data['steps'], true) : $data['steps'];
                
                $formattedSteps = array_map(function($step) {
                    return [
                        'step_number' => $step['step_number'],
                        'content'     => $step['content'],
                        'step_image'   => $step['step_image'] ?? null, // Đảm bảo luôn có key này
                    ];
                }, $stepsArr);

                $this->steps()->createMany($formattedSteps);
            }
            return $this;
        });
    }

    //Phan Lac An 22/01/2026
    public static function getRecipeForEdit($id)
    {
        return self::with(['ingredients', 'steps'])->find($id);
    }
}
