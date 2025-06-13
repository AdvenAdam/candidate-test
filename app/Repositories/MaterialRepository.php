<?php

namespace App\Repositories;

use App\Models\Material;

class MaterialRepository implements MaterialRepositoryInterface
{
    public function all()
    {
        return Material::all();
    }

    public function find($id)
    {
        return Material::findOrFail($id);
    }

    public function create(array $data)
    {
        return Material::create($data);
    }

    public function update($id, array $data)
    {
        $material = Material::findOrFail($id);
        $material->update($data);
        return $material;
    }

    public function delete($id)
    {
        $material = Material::find($id);

        if (!$material) {
            logger("Material with ID $id not found");
            return false;
        }

        return Material::destroy($id);
    }

    public function getByProject($projectId)
    {
        return Material::where('project_id', $projectId)->get();
    }
}
