<?php

declare(strict_types=1);

return [
    'key' => env('GEMINI_API_KEY'),
    'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1'),
    'timeout' => env('GEMINI_REQUEST_TIMEOUT', 60),
];
