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
    protected $table = 'categories';


    // Quan hệ: Một danh mục có nhiều công thức nấu ăn
    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    //Lấy danh sách tất cả danh mục
    public static function getList()
    {
        return self::orderBy('name', 'asc')->get();
    }
}
