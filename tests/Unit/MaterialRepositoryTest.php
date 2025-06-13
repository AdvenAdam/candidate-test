<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Material;
use App\Models\Project;
use App\Models\Supplier;
use App\Repositories\MaterialRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MaterialRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new MaterialRepository();
    }

    public function test_create_material()
    {
        $project = Project::factory()->create(); // create the related project

        // Create some suppliers
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));


        $data = [
            'name' => 'Test Material',
            'building_part_type' => 'Wall',
            'material' => 'clt',
            'supplier_id' => $suppliers->random()->id,
            'project_id' => $project->id, // use real project ID
        ];

        $material = $this->repository->create($data);

        $this->assertDatabaseHas('materials', ['name' => 'Test Material']);
        $this->assertInstanceOf(Material::class, $material);
    }

    public function test_find_material()
    {
        $material = Material::factory()->create();

        $found = $this->repository->find($material->id);

        $this->assertEquals($material->id, $found->id);
    }

    public function test_update_material()
    {
        $material = Material::factory()->create();

        $updated = $this->repository->update($material->id, ['name' => 'Updated Name']);

        $this->assertEquals('Updated Name', $updated->name);
        $this->assertDatabaseHas('materials', ['name' => 'Updated Name']);
    }

    public function test_delete_material()
    {
        $material = Material::factory()->create();

        $this->repository->delete($material->id);

        $this->assertDatabaseMissing('materials', ['id' => $material->id]);
    }

    public function test_get_all_materials()
    {
        Material::factory()->count(3)->create();

        $all = $this->repository->all();

        $this->assertCount(3, $all);
    }

    public function test_get_by_project()
    {
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));


        // Create 2 materials for project1
        Material::factory()->create([
            'project_id' => $project1->id,
            'supplier_id' => $suppliers->random()->id,
        ]);
        Material::factory()->create([
            'project_id' => $project1->id,
            'supplier_id' => $suppliers->random()->id,
        ]);

        // Create 1 material for project2
        Material::factory()->create([
            'project_id' => $project2->id,
            'supplier_id' => $suppliers->random()->id,
        ]);

        $materials = $this->repository->getByProject($project1->id);

        $this->assertCount(2, $materials);
        $this->assertTrue($materials->every(fn($m) => $m->project_id === $project1->id));
    }
}
