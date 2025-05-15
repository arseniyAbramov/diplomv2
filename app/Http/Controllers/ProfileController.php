<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Appointment;
use Carbon\Carbon;

class ProfileController extends Controller
{
    // 📊 Статистика по профилю
    public function stats()
    {
        $user = Auth::user();

        $appointments = Appointment::where('user_id', $user->id)->get();

        $total_income = $appointments->sum('master_share');
        $total_sessions = $appointments->count();
        $average_check = $total_sessions > 0 ? round($total_income / $total_sessions) : 0;

$by_day = $appointments->groupBy(function ($a) {
    return Carbon::parse($a->start_time)->format('d.m');
})->map(function ($group) {
    return [
        'date' => Carbon::parse($group->first()->start_time)->format('d.m'),
        'total' => $group->sum('master_share'),
    ];
})->values();

        return response()->json([
            'total_income' => $total_income,
            'total_sessions' => $total_sessions,
            'average_check' => $average_check,
            'by_day' => $by_day,
        ]);
    }

    // 📸 Загрузка аватарки
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = Auth::user();

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->avatar = '/storage/' . $path;
        $user->save();

        return response()->json(['avatar' => $user->avatar]);
    }

    // ✏️ Обновление имени, почты, пароля
    public function update(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => 'nullable|string',
            'surname' => 'nullable|string',
            'email' => 'nullable|email',
            'password' => 'nullable|confirmed|min:6',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update(array_filter($data));

        return response()->json(['status' => 'updated']);
    }
    public function staffList()
{
    $masters = \App\Models\User::where('role', 'master')->get();

    $result = $masters->map(function ($user) {
        $appointments = $user->appointments;

        $clients = $appointments->pluck('client_id')->unique()->count();
        $sessions = $appointments->count();
        $income = $appointments->sum('master_share');
        $average = $sessions > 0 ? round($income / $sessions) : 0;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'surname' => $user->surname,
            'avatar' => $user->avatar,
            'clients' => $clients,
            'sessions' => $sessions,
            'average_check' => $average,
        ];
    });

    return response()->json($result);
}
}