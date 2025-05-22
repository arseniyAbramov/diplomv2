<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BugReportController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'description' => 'required|string',
        ]);

        // Отправка письма
        Mail::raw("🛠️ Новый баг-репорт:\n\nЗаголовок: {$data['title']}\nПриоритет: {$data['priority']}\n\nОписание:\n{$data['description']}", function ($message) {
            $message->to('abramovarsenij2005@gmail.com')
                    ->subject('🐞 Новый баг-репорт с сайта');
        });

        return response()->json(['message' => 'Баг отправлен']);
    }
}