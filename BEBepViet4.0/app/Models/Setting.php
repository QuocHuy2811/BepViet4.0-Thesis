<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        "logo",
        "footer",
        "gmail",
        "phone",
    ];
    
    public $timestamps = false;
}
