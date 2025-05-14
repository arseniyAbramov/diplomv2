<?php
namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    // Список записей (можно будет добавить фильтры)
    public function index()
    {
        $user = Auth::user();

        $appointments = $user->role === 'admin'
            ? Appointment::with(['client', 'service', 'master'])->get()
            : $user->appointments()->with(['client', 'service'])->get();

        return response()->json($appointments);
    }

    // Создание записи
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'service_id' => 'required|exists:services,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'price' => 'required|numeric',
            'master_share' => 'required|numeric',
            'studio_share' => 'required|numeric',
        ]);

        $appointment = Appointment::create([
            ...$validated,
            'master_id' => Auth::id(),
        ]);

        return response()->json($appointment, 201);
    }

    // Обновление записи
    public function update(Request $request, Appointment $appointment)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $appointment->master_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'client_id' => 'exists:clients,id',
            'service_id' => 'exists:services,id',
            'start_time' => 'date',
            'end_time' => 'date|after:start_time',
            'price' => 'numeric',
            'master_share' => 'numeric',
            'studio_share' => 'numeric',
        ]);

        $appointment->update($validated);

        return response()->json($appointment);
    }

    // Удаление записи
    public function destroy(Appointment $appointment)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $appointment->master_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $appointment->delete();

        return response()->json(['status' => 'deleted']);
    }
}