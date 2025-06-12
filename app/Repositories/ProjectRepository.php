<?php

namespace App\Repositories;

use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function all(array $filters = [])
    {
        return Project::with(['materials', 'user'])
            ->when(
                isset($filters['user_id']),
                fn($q) => $q->where('user_id', $filters['user_id']),
                fn($q) => $q->where('user_id', Auth::id())
            )
            ->get();
    }


    public function find($id)
    {
        return Project::findOrFail($id)->with('materials')->first();
    }

    public function create(array $data)
    {
        return Project::create($data);
    }

    public function update($id, array $data)
    {
        $project = Project::findOrFail($id);
        $project->update($data);
        return $project;
    }

    public function delete($id)
    {
        return Project::destroy($id);
    }
}
