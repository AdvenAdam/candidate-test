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
            'building_part_type' => $this->faker->randomElement(['floor', 'wall', 'beam', 'column']),
            'material' => $this->faker->randomElement(['clt', 'glt']),
        ];
    }
}
