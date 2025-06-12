import {DataTable} from "@/components/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {usePage} from "@inertiajs/react";
import {PageProps as InertiaPageProps} from "@inertiajs/core";
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
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// Main component
const Index = () => {
  const {projects} = usePage<PageProps>().props;

  return (
    <AuthenticatedLayout header={<h2 className="text-xl leading-tight text-gray-800">Project</h2>}>
      <div className="my-4">
        <h1 className="text-5xl text-primary font-bold">Projects</h1>
      </div>
      <DataTable<RowType> data={projects} columns={columns} />
    </AuthenticatedLayout>
  );
};

export default Index;
