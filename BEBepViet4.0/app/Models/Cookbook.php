<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cookbook extends Model
{
    public $timestamps = false;
    protected $guarded = [];

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'recipe_cookbooks', 'cookbook_id', 'recipe_id');
    }
}
