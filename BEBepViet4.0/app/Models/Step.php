<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'recipe_id',
        'step_number',
        'content',
        'step_image'
    ];

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }

    //Nguyen Kien Duy 21/01/2026
    public function getStepImageAttribute($value)
    {
        if ($value == "null") {
            return asset("image/no_img.jpg");
        } else {
            return asset("storage/" . $value);
        }
    }
}
