<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\ProjectRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    protected $projectRepo;

    public function __construct(ProjectRepositoryInterface $projectRepo)
    {
        $this->projectRepo = $projectRepo;
    }

    public function index()
    {
        return response()->json($this->projectRepo->all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $data['user_id'] = Auth::id();

        $this->projectRepo->create($data);
    }

    public function show($id)
    {
        return response()->json($this->projectRepo->find($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
        ]);

        $project = $this->projectRepo->update($id, $data);
        return response()->json($project);
    }

    public function destroy($id)
    {
        $this->projectRepo->delete($id);
        return response()->json(null, 204);
    }
}
