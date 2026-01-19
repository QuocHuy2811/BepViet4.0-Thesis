<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = File::get(path: "database/json/tag.json");
        $tags = collect(json_decode($file));
        $tags->each(function ($tag) {
            Tag::create([
                "name" => $tag->name,
                "slug" => $tag->slug
            ]);
        });
    }
}
