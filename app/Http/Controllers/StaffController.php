<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;

class StaffController extends Controller
{
    public function index()
    {
        $masters = User::where('role', 'master')->get();

        $data = $masters->map(function ($master) {
            $appointments = Appointment::where('user_id', $master->id)->get();

            $clientCount = $appointments->pluck('client_id')->unique()->count();
            $sessionCount = $appointments->count();
            $totalIncome = $appointments->sum('master_share');
            $averageCheck = $sessionCount > 0 ? round($totalIncome / $sessionCount, 2) : 0;

            return [
                'id' => $master->id,
                'name' => $master->name,
                'surname' => $master->surname,
                'avatar' => $master->avatar,
                'clients' => $clientCount,
                'sessions' => $sessionCount,
                'average_check' => $averageCheck,
            ];
        });

        return response()->json($data);
    }
}