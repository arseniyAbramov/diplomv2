<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'status' => 'created',
            'service' => $service,
        ]);
    }
    public function index()
    {
        return response()->json(\App\Models\Service::all());
    }
}