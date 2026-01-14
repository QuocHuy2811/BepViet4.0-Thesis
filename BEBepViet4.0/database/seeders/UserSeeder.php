<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = File::get(path: "database/json/user.json");
        $users = collect(json_decode($file));
        $users->each(function ($user) {
            User::create([
                "username" => $user->username,
                "email" => $user->email,
                "password" => $user->password,
                "full_name" => $user->full_name,
                "role" => $user->role
            ]);
        });
    }
}
