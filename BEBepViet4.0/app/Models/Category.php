<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
class Category extends Model
{
    use Sluggable;
     protected $fillable = ['name', 'slug', 'status'];

     public  function sluggable():array{
        return[
            'slug'=>[
                'source'=>'name',
                'unique'=>true,
                'onUpdate'=>true,
            ]
        ];
     }
     
    public $timestamps = false;
    protected $guarded = [];
}
