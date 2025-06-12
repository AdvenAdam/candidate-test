<?

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\MaterialRepositoryInterface;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    protected $materialRepo;

    public function __construct(MaterialRepositoryInterface $materialRepo)
    {
        $this->materialRepo = $materialRepo;
    }

    public function index($projectId)
    {
        return response()->json($this->materialRepo->getByProject($projectId));
    }

    public function store(Request $request, $projectId)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer',
        ]);

        $data['project_id'] = $projectId;

        $material = $this->materialRepo->create($data);
        return response()->json($material, 201);
    }

    public function update(Request $request, $projectId, $id)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'quantity' => 'sometimes|required|integer',
        ]);

        $material = $this->materialRepo->update($id, $data);
        return response()->json($material);
    }

    public function destroy($projectId, $id)
    {
        $this->materialRepo->delete($id);
        return response()->json(null, 204);
    }
}
