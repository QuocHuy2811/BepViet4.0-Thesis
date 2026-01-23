<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->foreignId("recipe_id")->references("id")->on("recipes");
            $table->foreignId("ingredient_id")->references("id")->on("ingredients");
            $table->string("amount", 100);
            $table->string("note", 255);
            $table->primary(["recipe_id", "ingredient_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
