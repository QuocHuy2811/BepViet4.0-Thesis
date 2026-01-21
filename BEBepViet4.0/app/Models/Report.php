<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    public $timestamps = false;
    protected $table = 'reports';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public static function getListReports()
    {
        return self::with('user:id,username')->get();
    }
}
