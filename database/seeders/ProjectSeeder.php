<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\Project;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        DB::table('materials')->truncate();
        DB::table('projects')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = User::all();

        Project::factory()
            ->count(5)
            ->create()
            ->each(function ($project) use ($users) {
                $project->user_id = $users->random()->id;
                $project->save();

                for ($i = 0; $i < 3; $i++) {
                    $materialType = fake()->randomElement(['clt', 'glt']);
                    $supplier = Supplier::randomByType($materialType);

                    Material::factory()->create([
                        'project_id' => $project->id,
                        'supplier_id' => $supplier?->id,
                        'material' => $materialType,
                    ]);
                }
            });
    }
}
