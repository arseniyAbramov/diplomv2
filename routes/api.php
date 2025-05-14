<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceController;

// 👤 Аутентификация
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 💬 Тестовое сообщение
Route::post('/message', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string',
        'message' => 'required|string',
    ]);

    return response()->json([
        'status' => 'success',
        'data' => $validated,
    ]);
});

// 📄 Общедоступные ресурсы (если не защищаешь)
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/clients', [ClientController::class, 'store']);
Route::post('/services', [ServiceController::class, 'store']);

// 🔐 Защищённые маршруты (требуют токен)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'ok',
            'user' => $request->user(),
        ]);
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'logged_out'
        ]);
    });

    // 📅 CRUD для записей
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::patch('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
});