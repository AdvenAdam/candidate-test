type MaterialType = {
  id: number;
  project_id: number;
  name: string;
  building_part_type: 'column' | 'beam' | string; // add more types if needed
  material: 'clt' | 'glt' | string; // add more material types if needed
  supplier_id: number;
  supplier: SupplierType;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

type ProjectType = {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  materials: MaterialType[];
};

type SupplierType = {
  id: number;
  name: string;
  material_type: 'clt' | 'glt' | string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
};

export { MaterialType, ProjectType, SupplierType };