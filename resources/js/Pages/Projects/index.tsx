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
import {MoreVerticalIcon} from "lucide-react";
import {route} from "ziggy-js";
import {useState} from "react";
import DeleteModal from "@/components/delete-modal";
import {toast} from "sonner";

// Schema and types
const schema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});
type RowType = z.infer<typeof schema>;

interface PageProps extends InertiaPageProps {
  projects: RowType[];
}

// Main component
const Index = () => {
  const {projects} = usePage<PageProps>().props;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const columns: ColumnDef<RowType>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({row}) => row.original.name,
    },
    {
      accessorKey: "description",
      header: "Description",
      enableResizing: true,
      cell: ({row}) => row.original.description,
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
            <DropdownMenuItem asChild className="hover:cursor-pointer">
              <a href={route("project.edit", row.original.id)}>Edit</a>
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

  const handleDeleteClick = (id: number) => {
    setDeleteModalOpen(true);
    setDeleteId(id);
  };

  const handleDeleteAction = () => {
    router.delete(route("project.destroy", deleteId), {});
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl leading-tight text-gray-800">Project</h2>}>
      <div className="my-4">
        <h1 className="text-5xl text-primary font-bold">Projects</h1>
      </div>
      <DataTable<RowType> data={projects} columns={columns} tableType="projects" />
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        description="Are you sure you want to delete this project?"
        title="Delete Project"
        deleteAction={handleDeleteAction}
      />
    </AuthenticatedLayout>
  );
};

export default Index;
