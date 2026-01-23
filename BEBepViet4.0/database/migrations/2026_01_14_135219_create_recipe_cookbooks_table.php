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
        Schema::create('recipe_cookbooks', function (Blueprint $table) {
            $table->foreignId("recipe_id")->references("id")->on("recipes");
            $table->foreignId("cookbook_id")->references("id")->on("cookbook");
            $table->primary(["recipe_id", "cookbook_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_cookbooks');
    }
};
