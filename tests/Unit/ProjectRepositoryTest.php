<?php

namespace Tests\Unit;

use App\Models\Material;
use App\Models\Project;
use App\Models\Supplier;
use App\Repositories\ProjectRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected ProjectRepository $projectRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->projectRepository = new ProjectRepository();
    }

    public function test_can_create_project()
    {
        $data = [
            'name' => 'Test Project',
            'description' => 'Some description',
        ];

        $project = $this->projectRepository->create($data);

        $this->assertInstanceOf(Project::class, $project);
        $this->assertDatabaseHas('projects', ['name' => 'Test Project']);
    }

    public function test_can_update_project()
    {
        $project = Project::factory()->create();

        $updated = $this->projectRepository->update($project->id, [
            'name' => 'Updated Name',
        ]);

        $this->assertInstanceOf(Project::class, $updated);
        $this->assertEquals('Updated Name', $updated->name);
        $this->assertDatabaseHas('projects', ['name' => 'Updated Name']);
    }


    public function test_can_delete_project()
    {
        // Create a new project
        $project = Project::factory()->create();

        // Call the repository delete method
        $result = $this->projectRepository->delete($project->id);

        // Assert the result is true (1 row deleted)
        $this->assertEquals(1, $result);

        // Assert the project no longer exists in the database
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    public function test_can_get_all_projects_with_materials()
    {
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));

        Project::factory()
            ->count(2)
            ->create()
            ->each(function ($project) use ($suppliers) {
                $supplier = $suppliers->random();
                Material::factory()->count(2)->create([
                    'project_id' => $project->id,
                    'supplier_id' => $supplier->id,
                ]);
            });

        $all = $this->projectRepository->all();

        $this->assertCount(2, $all); // Should return 2 projects

        foreach ($all as $project) {
            $this->assertCount(2, $project->materials); // Each should have 2 materials
        }
    }

    public function test_can_get_specific_project_with_materials()
    {
        $project = Project::factory()->create();
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));

        $supplier = $suppliers->random();

        Material::factory()->count(3)->create([
            'project_id' => $project->id,
            'supplier_id' => $supplier->id, // include supplier_id
        ]);

        $found = $this->projectRepository->find($project->id);

        $this->assertEquals(3, $found->materials->count());
    }
}
