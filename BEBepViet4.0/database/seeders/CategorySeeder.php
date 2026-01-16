<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = File::get(path: "database/json/category.json");
        $categories = collect(json_decode($file));
        $categories->each(function ($category) {
            Category::create([
                "name" => $category->name,
                "slug" => $category->slug
            ]);
        });
    }
}
