<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    public $timestamps = false;
    protected $guarded = [];
    protected $table = 'blogs';

    public function xoaBlogs()
    {
        // Nếu blog có comment
        return $this->delete();
    }
}
