<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $timestamps = false;
    protected $table = 'categories';

    protected $fillable = ['name', 'slug'];

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
