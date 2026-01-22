<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
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
