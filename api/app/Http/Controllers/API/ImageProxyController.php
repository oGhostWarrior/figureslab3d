<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;

class ImageProxyController extends Controller
{
    public function fetch(Request $request)
    {
        $url = $request->query('url');

        if (!$url) {
            return response()->json(['error' => 'URL is required'], 400);
        }

        try {
            $imageResponse = Http::withHeaders([
                'User-Agent' => 'FiguresLabBot/1.0',
            ])->withOptions(['verify' => false])
                ->get($url);

            if (!$imageResponse->successful()) {
                return response()->json(['error' => 'Failed to fetch image'], 500);
            }

            return response($imageResponse->body(), 200)
                ->header('Content-Type', $imageResponse->header('Content-Type'))
                ->header('Access-Control-Allow-Origin', '*');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching image'], 500);
        }
    }
}
