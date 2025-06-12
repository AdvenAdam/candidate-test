<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Repositories\ProjectRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    protected $projectRepo;

    public function __construct(ProjectRepositoryInterface $projectRepo)
    {
        $this->projectRepo = $projectRepo;
    }

    public function index()
    {
        $projects = $this->projectRepo->all();
        return Inertia::render('Projects/Index', ['projects' => $projects]);
    }
}
