<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $guarded = [];
    //Nguyen Kien Duy
    public function user()
    {
        return $this->belongsTo(User::class);
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
