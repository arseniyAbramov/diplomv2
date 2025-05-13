<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;

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
        // ⚠️ роль не должна задаваться с фронта напрямую — только временно, для тестов
        'role' => 'in:user,admin', // добавим, но потом ограничим
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'surname' => $validated['surname'] ?? null,
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
        'avatar' => $validated['avatar'] ?? null,
        'role' => $validated['role'] ?? 'user',
    ]);

    return response()->json([
        'status' => 'registered',
        'user' => $user,
    ]);
}
}
