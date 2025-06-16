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

        return [
            'name' => $this->faker->word(),
            'building_part_type' => $this->faker->randomElement(['wall', 'floor', 'beam']),
            'material' => 'clt',
            'project_id' => Project::factory(),
            'supplier_id' => null,
        ];
    }
}
