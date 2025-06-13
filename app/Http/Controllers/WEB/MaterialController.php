<?php

namespace App\Http\Controllers\WEB;

use App\Http\Controllers\Controller;
use App\Repositories\MaterialRepositoryInterface;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    protected $materialRepo;

    public function __construct(MaterialRepositoryInterface $materialRepo)
    {
        $this->materialRepo = $materialRepo;
    }


    public function store(Request $request, $projectId)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'building_part_type' => 'required|string',
            'material' => 'required|string|in:clt,glt',
            'supplier_id' => 'required',
        ]);

        $data['project_id'] = $projectId;
        $this->materialRepo->create($data);
        return redirect()->back()
            ->with('success', 'Material created successfully!');
    }

    public function update(Request $request, $projectId, $id)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'building_part_type' => 'required|string',
            'material' => 'required|string|in:clt,glt',
            'supplier_id' => 'required',
        ]);

        $data['project_id'] = $projectId;
        $this->materialRepo->update($id, $data);
        return redirect()->back()
            ->with('success', 'Material updated successfully!');
    }

    public function destroy($projectId, $id)
    {
        $this->materialRepo->delete($id);

        return back()->with('success', 'Material deleted successfully!');
    }
}
