<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\Project;
use App\Models\Supplier;
use App\Models\User;
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


        // Get all users
        $users = User::all();

        Project::factory()
            ->count(5)
            ->create()
            ->each(function ($project) use ($suppliers, $users) {
                // Assign a random user
                $project->user_id = $users->random()->id;
                $project->save();

                // Attach 3 materials with a random supplier
                Material::factory()
                    ->count(3)
                    ->create([
                        'project_id' => $project->id,
                        'supplier_id' => $suppliers->random()->id,
                    ]);
            });
    }
}
