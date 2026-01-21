<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Blog extends Model
{

    use Sluggable;
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'status',
        'thumbnail',
        'slug',
    ];
    public function sluggable():array{
        return[
            'slug'=>[
                'source'=>'title',
                'unique'=>true,
                'onUpdate'=>true,
            ]
        ];
     }


    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_tags', 'blog_id', 'tag_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
        public $timestamps = false;
}
