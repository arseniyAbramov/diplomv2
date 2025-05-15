<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\Auth\EmailVerificationController;

// 👤 Аутентификация
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

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

// 📄 Общедоступные ресурсы
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/clients', [ClientController::class, 'store']);
Route::post('/services', [ServiceController::class, 'store']);

// ✅ Подтверждение Email (без авторизации)
Route::get('/email/verify/{id}/{hash}', EmailVerificationController::class)
    ->middleware(['signed'])
    ->name('verification.verify');

// 📤 Повторная отправка письма
Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email уже подтверждён']);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Письмо отправлено повторно']);
})->middleware(['auth:sanctum'])->name('verification.send');

// 🔐 Защищённые маршруты
Route::middleware('auth:sanctum')->group(function () {

    // ✅ Только подтверждённые
    Route::middleware('verified')->get('/user', function (Request $request) {
        return response()->json([
            'status' => 'ok',
            'user' => $request->user(),
        ]);
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['status' => 'logged_out']);
    });

    // 🔐 Только админ
    Route::middleware('role:admin')->group(function () {

        // 🧑‍💼 Список всех пользователей
        Route::get('/users', function () {
            return User::all();
        });

        // 🔁 Обновление роли пользователя
        Route::patch('/users/{user}/role', function (User $user, Request $request) {
            $request->validate([
                'role' => 'required|in:user,admin,master',
            ]);

            $user->role = $request->role;
            $user->save();

            return response()->json(['status' => 'updated']);
        });

        // 🤖 Пример админ-доступа
        Route::get('/admin-only', function () {
            return response()->json([
                'message' => 'Ты админ, добро пожаловать 😎'
            ]);
        });
    });

    // 📅 CRUD для записей
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::patch('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
});