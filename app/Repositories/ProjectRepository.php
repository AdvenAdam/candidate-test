<?php

namespace App\Repositories;

use App\Models\Project;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function all()
    {
        return Project::with('materials')->get();
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
