<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\MaterialController;
use App\Http\Controllers\API\SupplierController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public test route (optional)
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/material-types', [SupplierController::class, 'getMaterialTypes']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum', 'auth'])->group(function () {

    // Project routes (RESTful)
    Route::apiResource('projects', ProjectController::class);

    // Nested materials under a project
    Route::prefix('projects/{project}')->group(function () {
        Route::get('materials', [MaterialController::class, 'index']);
        Route::post('materials', [MaterialController::class, 'store']);
        Route::put('materials/{material}', [MaterialController::class, 'update']);
        Route::delete('materials/{material}', [MaterialController::class, 'destroy']);
    });


    // Nested materials under a supplier
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::get('/suppliers/{supplier}', [SupplierController::class, 'show']);
});
Route::get('/supplier-materials', [SupplierController::class, 'getSupplierMaterials']);
