<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $client = Client::create($validated);

        return response()->json([
            'status' => 'created',
            'client' => $client,
        ]);
    }
     public function index()
    {
        return response()->json(\App\Models\Client::all());
    }
}