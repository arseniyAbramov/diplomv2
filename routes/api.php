<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Auth\EmailVerificationController;

// 🔐 Аутентификация
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// ✅ Email подтверждение
Route::get('/email/verify/{id}/{hash}', EmailVerificationController::class)
    ->middleware(['signed'])
    ->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email уже подтверждён']);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Письмо отправлено повторно']);
})->middleware(['auth:sanctum'])->name('verification.send');

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

// 📄 Публичные ресурсы
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);

// 🔐 Защищённые маршруты
Route::middleware('auth:sanctum')->group(function () {

    // 📥 Выход
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['status' => 'logged_out']);
    });

    // ✅ Проверка подтверждения
    Route::middleware('verified')->get('/user', function (Request $request) {
        return response()->json([
            'status' => 'ok',
            'user' => $request->user(),
        ]);
    });

    // 🧑 Админ-права
    Route::middleware('role:admin')->group(function () {

        // 👤 Пользователи
        Route::get('/users', function () {
            return User::all();
        });

        Route::patch('/users/{user}/role', function (User $user, Request $request) {
            $request->validate([
                'role' => 'required|in:user,admin,master',
            ]);

            $user->role = $request->role;
            $user->save();

            return response()->json(['status' => 'updated']);
        });

        Route::patch('/users/{user}', function (User $user, Request $request) {
            $validated = $request->validate([
                'name' => 'required|string',
                'surname' => 'nullable|string',
                'email' => 'required|email',
                'role' => 'required|in:user,admin,master',
            ]);

            $user->update($validated);

            return response()->json($user);
        });

        Route::delete('/users/{user}', function (User $user) {
            $user->delete();
            return response()->json(['status' => 'deleted']);
        });

        // 👥 Клиенты
        Route::post('/clients', [ClientController::class, 'store']);
        Route::patch('/clients/{client}', [ClientController::class, 'update']);
        Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

        // 💼 Услуги
        Route::get('/services', [ServiceController::class, 'index']);
        Route::post('/services', [ServiceController::class, 'store']);
        Route::patch('/services/{service}', [ServiceController::class, 'update']);
        Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
    });

    // 📅 Записи (Appointments)
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::patch('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
});