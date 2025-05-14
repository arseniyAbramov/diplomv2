<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\URL; // не забудь подключить сверху

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'avatar' => 'nullable|url',
            'role' => 'in:user,admin',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'] ?? null,
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'avatar' => $validated['avatar'] ?? null,
            'role' => $validated['role'] ?? 'user',
        ]);

        // 💌 Вставляем вот сюда
        $user->sendEmailVerificationNotification();

        return response()->json([
            'status' => 'registered',
            'message' => 'Письмо с подтверждением отправлено на почту',
        ]);
    }
public function login(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $validated['email'])->first();

    if (! $user || ! Hash::check($validated['password'], $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Неверные учетные данные.'],
        ]);
    }

    // 👉 Позволяем зайти, но блокируем токен до верификации
    if (! $user->hasVerifiedEmail()) {
        // ⚠️ возвращаем временный токен, но не выдаём доступ к API
        return response()->json([
            'message' => 'Вы должны подтвердить свой email перед входом.',
            'verify_url' => URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['id' => $user->id, 'hash' => sha1($user->email)]
            ),
        ], 403);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
}
}