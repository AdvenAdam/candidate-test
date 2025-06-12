<?php

namespace App\Http\Controllers\WEB;

use App\Http\Controllers\Controller;
use App\Repositories\ProjectRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    protected $projectRepo;

    public function __construct(ProjectRepositoryInterface $projectRepo)
    {
        $this->projectRepo = $projectRepo;
    }

    public function index()
    {
        $projects = $this->projectRepo->all();
        return Inertia::render('Projects/index', ['projects' => $projects]);
    }

    public function show($project)
    {
        return Inertia::render('Projects/show', ['project' => $project]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $data['user_id'] = Auth::id();

        $this->projectRepo->create($data);
        return redirect()->route('project.index')
            ->with('success', 'Project created successfully!');
    }

    public function destroy($id)
    {
        $this->projectRepo->delete($id);
        return redirect()->route('project.index')
            ->with('success', 'Project created successfully!');
    }
}
