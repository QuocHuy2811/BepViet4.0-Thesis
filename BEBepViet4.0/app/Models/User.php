<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }
    public function getImgAvatarAttribute($value)
    {
        if ($value == null) {
            return asset("image/avatar.jpg");
        } else {
            return asset("storage/" . $value);
        }
    }

    public function cookbooks()
    {   
        return $this->hasMany(Cookbook::class, 'user_id', 'id');
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follows', 'followed_id', 'follower_id');
    }

    public function followings()
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'followed_id');
    }

    public function getFullProfile() {
        return $this->loadCount(['recipes', 'cookbooks', 'blogs', 'followers', 'followings'])
                    ->load(['recipes', 'cookbooks.recipes', 'blogs']);
    }


    public function updateProfile($data, $avatarFile = null)
    {
        if ($avatarFile) {
            // Xóa ảnh cũ nếu có
            if ($this->getRawOriginal('img_avatar')) {
                Storage::disk('public')->delete($this->getRawOriginal('img_avatar'));
            }
            // Lưu ảnh mới
            $this->img_avatar = $avatarFile->store('avatars', 'public');
        }
        $this->full_name = $data['full_name'] ?? $this->full_name;
        $this->username = $data['username'] ?? $this->username;
        $this->email = $data['email'] ?? $this->email;
        $this->bio = $data['bio'] ?? $this->bio;
        return $this->save();
    }

    public function createNewCookbook($name)
    {
        return $this->cookbooks()->create(['name' => $name]);
    }
}
