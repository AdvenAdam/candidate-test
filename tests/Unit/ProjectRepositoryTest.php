<?php

namespace Tests\Unit;

use App\Models\Material;
use App\Models\Project;
use App\Models\Supplier;
use App\Models\User;
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
        // Create a user
        $user = User::factory()->create();

        // Define project data with user_id
        $data = [
            'name' => 'Test Project',
            'description' => 'Some description',
            'user_id' => $user->id,
        ];

        // Create the project
        $project = $this->projectRepository->create($data);

        // Assertions
        $this->assertInstanceOf(Project::class, $project);
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'user_id' => $user->id,
        ]);
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

    public function test_can_get_all_projects_with_materials_by_user()
    {
        // Create two users
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        // Create some suppliers
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));

        // Create 2 projects for user A and 1 for user B
        $userAProjects = Project::factory()->count(2)->create(['user_id' => $userA->id]);
        Project::factory()->create(['user_id' => $userB->id]);

        // Assign materials to all projects
        Project::all()->each(function ($project) use ($suppliers) {
            $supplier = $suppliers->random();
            Material::factory()->count(2)->create([
                'project_id' => $project->id,
                'supplier_id' => $supplier->id,
            ]);
        });

        // Retrieve only projects for user A
        $projects = $this->projectRepository->all(['user_id' => $userA->id]);

        // Assert only 2 projects returned
        $this->assertCount(2, $projects);

        // Assert each project has 2 materials
        foreach ($projects as $project) {
            $this->assertCount(2, $project->materials);
            $this->assertEquals($userA->id, $project->user_id);
        }
    }


    public function test_can_get_specific_project_with_materials_by_user()
    {
        // Create user
        $user = User::factory()->create();

        // Create project for this user
        $project = Project::factory()->create([
            'user_id' => $user->id,
        ]);

        // Create suppliers
        $suppliers = collect([
            ['name' => 'Sodra', 'material_type' => 'clt'],
            ['name' => 'KLH', 'material_type' => 'clt'],
            ['name' => 'XLam', 'material_type' => 'clt'],
            ['name' => 'Kalvasta Timber', 'material_type' => 'glt'],
            ['name' => 'Timberlink', 'material_type' => 'glt'],
        ])->map(fn($data) => Supplier::create($data));

        // Pick one supplier and assign 3 materials to the project
        $supplier = $suppliers->random();

        Material::factory()->count(3)->create([
            'project_id' => $project->id,
            'supplier_id' => $supplier->id,
        ]);

        // Find the project by ID and user_id
        $found = $this->projectRepository->find($project->id, ['user_id' => $user->id]);

        // Assertions
        $this->assertNotNull($found);
        $this->assertEquals($project->id, $found->id);
        $this->assertEquals($user->id, $found->user_id);
        $this->assertCount(3, $found->materials);
    }
}
