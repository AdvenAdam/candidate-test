import {DataTable} from "@/components/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {usePage} from "@inertiajs/react";
import {PageProps as InertiaPageProps, router} from "@inertiajs/core";
import {ColumnDef} from "@tanstack/react-table";
import z from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVerticalIcon, PlusIcon} from "lucide-react";
import {route} from "ziggy-js";
import {MaterialType, ProjectType} from "@/types/Project";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import AddMaterial from "@/components/add-material-modal";
import DeleteModal from "@/components/delete-modal";

// Schema and types

const projectSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  description: z.string().min(1, {message: "Description is required"}),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface PageProps extends InertiaPageProps {
  project: ProjectType;
}

// Main component
const Index = () => {
  const {project} = usePage<PageProps>().props;
  const [editMaterialModal, setEditMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>({} as MaterialType);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const Header = () => (
    <div className="flex items-center gap-2">
      <a href={route("project.index")} className="text-xl leading-tight text-primary">
        Projects
      </a>
      <h2 className="text-lg leading-tight text-gray-800">/</h2>
      <h2 className="text-xl leading-tight text-gray-800">{project.name}</h2>
    </div>
  );

  const {errors: serverErrors} = usePage().props as {
    errors: Partial<Record<keyof ProjectFormValues, string>>;
  };

  const columns: ColumnDef<MaterialType>[] = [
    {
      header: "#",
      cell: ({row}) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({row}) => row.original.name,
    },
    {
      accessorKey: "type",
      header: "Type",
      enableResizing: true,
      cell: ({row}) => row.original.building_part_type,
    },
    {
      accessorKey: "material",
      header: "Material",
      enableResizing: true,
      cell: ({row}) => row.original.material,
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      enableResizing: true,
      cell: ({row}) => row.original.supplier.name,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({row}) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon">
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem className="hover:cursor-pointer" onClick={handleEditModal(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(row.original.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "all",
  });

  useEffect(() => {
    if (serverErrors.name) {
      setError("name", {type: "server", message: serverErrors.name});
    }
    if (serverErrors.description) {
      setError("description", {type: "server", message: serverErrors.description});
    }
  }, [serverErrors, setError]);

  const onSubmit = (data: ProjectFormValues) => {
    router.put(route("project.update", project.id), data, {
      onSuccess: () => {},
    });
  };
  const handleEditModal = (material: MaterialType) => () => {
    setSelectedMaterial(material);
    setEditMaterialModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteModalOpen(true);
    setDeleteId(id);
  };

  const handleDeleteAction = () => {
    router.delete(route("project.material.destroy", {project: project.id, material: deleteId}));
  };

  return (
    <AuthenticatedLayout header={<Header />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-4 flex items-center justify-between">
          <h1 className="text-5xl text-primary font-bold">
            <span className="text-gray-800">Edit</span> "{project.name}"
          </h1>
          <Button variant="default" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Save Project</span>
          </Button>
        </div>
        <div className="grid gap-4 py-4 max-w-2xl">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue={project.name}
              type="text"
              {...register("name")}
              placeholder="Type project name here."
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              defaultValue={project.description}
              id="description"
              {...register("description")}
              placeholder="Type project description here."
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </div>
      </form>

      <DataTable<MaterialType> data={project.materials} columns={columns} tableType="materials" />
      <AddMaterial initialValues={selectedMaterial} open={editMaterialModal} setOpen={setEditMaterialModal} />
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        description="Are you sure you want to delete this material?"
        title="Delete Material"
        deleteAction={handleDeleteAction}
      />
    </AuthenticatedLayout>
  );
};

export default Index;
