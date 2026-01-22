<?php

namespace App\Http\Controllers\user;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\BlogRequest;
use App\Models\Blog;
use App\Models\Tag;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with(['tags','author'])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $blogs], 200);
    }

    public function blog(BlogRequest $request)
    {
        $validated = $request->validated();
        $baseslug= Str::slug($request->title);
        $slug = $baseslug;
        $i = 1;
        while (Blog::where('slug', $slug)->exists())
        {
            $slug = $baseslug.'-'.$i; $i++;
        }
        $thumbnail=null;
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail')->store('blogs', 'public');
        }
        $blog = Blog::create([
            'user_id'   => $request->user()->id,
            'title'     => $request->title,
            'content'   => $request->content,
            'status'    => $request->status,
            'thumbnail' => $thumbnail,
            'slug'      => $slug,
        ]);
        if ($request->filled('tags')) {
            $tags = explode(',', $request->tags);

            foreach ($tags as $t) {
                $t = trim($t);
                if ($t === '') continue;

                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($t)],
                    ['name' => $t, 'slug' => Str::slug($t)]
                );

                $blog->tags()->attach($tag->id);
            }
        }
        return response()->json([
            'message' => 'Tạo blog thành công',
            'data' => [
                'id' => $blog->id,
                'title' => $blog->title,
                'slug' => $blog->slug,
                'status' => $blog->status,
                'content' => $blog->content,
                'thumbnail' => $blog->thumbnail,
            ]
        ], 201);
    }
    public function update(BlogRequest $request, $id)
    {
        $blog = Blog::findOrFail($id);
        $validated = $request->validated();
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để cập nhật bài viết'
            ], 401);
        }
        if ((int)$blog->user_id !== (int)$user->id) {
            return response()->json([
                'message' => 'Bạn không có quyền cập nhật bài viết này'
            ], 403);
        }


        if ($request->hasFile('thumbnail')) {
            if ($blog->thumbnail && $blog->thumbnail !== 'null') {
                Storage::disk('public')->delete($blog->thumbnail);
            }
            $thumbnail = $request->file('thumbnail')->store('blogs', 'public');
            $blog->thumbnail = $thumbnail;
        }

        $blog->title = $request->title;
        $blog->content = $request->content;
        $blog->status = $request->status;

        $blog->save();
        if ($request->filled('tags')) {
            $tags = collect(explode(',', $request->tags))
                ->map(fn($t) => trim($t))
                ->filter()
                ->unique();

                $tagId = [];
            foreach ($tags as $t) {
                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($t)],
                    ['name' => $t, 'slug' => Str::slug($t)]
                );
                $tagId[] = $tag->id;
            }

            $blog->tags()->sync($tagId);
        } else {
            $blog->tags()->sync([]);
        }


        return response()->json([
            'message' => 'Cập nhật blog thành công',
            'data' => [
                'id' => $blog->id,
                'title' => $blog->title,

                'status' => $blog->status,
                'thumbnail' => $blog->thumbnail,
                'content' => $blog->content,
            ]
        ], 200);
    }
    public function delete($id)
    {
        $blog = Blog::findOrFail($id);
        $user = request()->user();
        if (!$user) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để xóa bài viết'
            ], 401);
        }
        if ((int)$blog->user_id !== (int)$user->id) {
            return response()->json([
                'message' => 'Bạn không có quyền xóa bài viết này'
            ], 403);
        }

        if ($blog->thumbnail && $blog->thumbnail !== 'null') {
            Storage::disk('public')->delete($blog->thumbnail);
        }
        $blog->tags()->detach();
        $blog->delete();

        return response()->json([
            'message' => 'Xóa blog thành công'
        ], 200);
    }
}
