<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * Return a JSON list of all suppliers.
     */
    public function index(): JsonResponse
    {
        $suppliers = Supplier::orderBy('id')
            ->select('id', 'name', 'material_type')
            ->get();

        return response()->json($suppliers);
    }

    /**
     * Return a JSON response for a specific supplier.
     */
    public function show(Supplier $supplier): JsonResponse
    {
        $supplier = $supplier->only(['id', 'name', 'material_type']);
        return response()->json($supplier);
    }

    public function getSupplierMaterials(Request $request): JsonResponse
    {
        $type = strtolower($request->input('type'));
        $materials = Supplier::where('material_type', $type)
            ->orderBy('id')
            ->get()->unique('name')
            ->values();

        return response()->json($materials);
    }

    public function getMaterialTypes(Request $request)
    {
        $partType = strtolower($request->input('partType'));

        $materialTypes = match ($partType) {
            'floor', 'wall' => [['value' => 'clt', 'label' => 'CLT']],
            'beam' => [
                ['value' => 'clt', 'label' => 'CLT'],
                ['value' => 'glt', 'label' => 'GLT']
            ],
            'column' => [['value' => 'glt', 'label' => 'GLT']],
            default => []
        };

        return response()->json($materialTypes);
    }
}
