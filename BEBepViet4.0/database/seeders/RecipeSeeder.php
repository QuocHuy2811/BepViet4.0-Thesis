<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = File::get(path: "database/json/recipe.json");
        $recipes = collect(json_decode($file));
        $recipes->each(function ($recipe) {
            Recipe::create([
                "user_id" => $recipe->user_id,
                "region" => $recipe->region,
                "difficult" => $recipe->difficult,
                "title" => $recipe->title,
                "slug" => $recipe->slug,
                "description" => $recipe->description,
                "img_path" => $recipe->img_path,
                "cook_time" => $recipe->cook_time,
                "views" => $recipe->views,
                "category_id" => $recipe->category_id
            ]);
        });
    }
}
