<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $dsCategory=Category::all();
        return response()->json($dsCategory);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required|string'
        ]);
        $category = Category::create([
            'name'=>$request->name,
        ]);
        return response()->json($category,201);
    }
    public function show($id)
    {
        $data = Category::findOrFail($id);
        return response()->json($data);
    }
    public function update (Request $request , $id)
    {
        $request ->validate([
            'name'=>'required|string',
            'status'=>'required|in:0,1'
        ]);
        $category = Category::findOrFail($id);

        $category->update([
            'name'=> $request->name,
            'status'=> $request ->status,
        ]);
        return response()->json($category);
    }
    
}
