<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\Project;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {

        // Safer: delete child tables first
        Material::query()->delete();
        Supplier::query()->delete();
        Project::query()->delete();

        // Seed fixed suppliers first
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));


        Project::factory()
            ->count(5)
            ->create()
            ->each(function ($project) use ($suppliers) {
                // Create 1 supplier per project for simplicity
                $supplier = $suppliers->random(); //

                // Attach 3 materials to each project
                Material::factory()
                    ->count(3)
                    ->create([
                        'project_id' => $project->id,
                        'supplier_id' => $supplier->id,
                    ]);
            });
    }
}
