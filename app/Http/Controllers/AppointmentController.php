<?php
namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    // Получение всех записей
    public function index()
    {
        $user = Auth::user();

        $appointments = $user->role === 'admin'
            ? Appointment::with(['client', 'service', 'user'])->get()
            : $user->appointments()->with(['client', 'service'])->get();

        return response()->json($appointments);
    }

    // Создание новой записи
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'service_id' => 'required|exists:services,id',
            'user_id'    => 'required|exists:users,id', // ← теперь явно передаётся
            'start_time' => 'required|date',
            'end_time'   => 'required|date|after:start_time',
            'price'      => 'required|numeric',
            'master_share' => 'required|numeric',
            'studio_share' => 'required|numeric',
        ]);

        $appointment = Appointment::create($validated);

        return response()->json($appointment, 201);
    }

    // Обновление
    public function update(Request $request, Appointment $appointment)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $appointment->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'client_id' => 'sometimes|exists:clients,id',
            'service_id' => 'sometimes|exists:services,id',
            'user_id'    => 'sometimes|exists:users,id',
            'start_time' => 'sometimes|date',
            'end_time'   => 'sometimes|date|after:start_time',
            'price'      => 'sometimes|numeric',
            'master_share' => 'sometimes|numeric',
            'studio_share' => 'sometimes|numeric',
        ]);

        $appointment->update($validated);

        return response()->json($appointment);
    }

    // Удаление
    public function destroy(Appointment $appointment)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $appointment->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $appointment->delete();

        return response()->json(['status' => 'deleted']);
    }
}