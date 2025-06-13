<?php

namespace Database\Factories;

use App\Models\Material;
use App\Models\Project;
use App\Models\Projects;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class MaterialFactory extends Factory
{
    protected $model = Material::class;

    public function definition(): array
    {
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));

        return [
            'name' => $this->faker->word(),
            'building_part_type' => $this->faker->randomElement(['wall', 'floor', 'beam']),
            'material' => $this->faker->randomElement(['clt', 'glt']),
            'project_id' => Project::factory(),
            'supplier_id' => $suppliers->random()->id,
        ];
    }
}
