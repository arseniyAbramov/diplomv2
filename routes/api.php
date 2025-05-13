<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


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
