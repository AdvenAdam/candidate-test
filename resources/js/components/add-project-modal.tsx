import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {PlusIcon} from "lucide-react";
import {z} from "zod";
import {Textarea} from "./ui/textarea";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {router, usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import {route} from "ziggy-js";
import {AuthProps} from "@/types/Auth";

const projectSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  description: z.string().min(1, {message: "Description is required"}),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AddProject() {
  const {errors: serverErrors} = usePage().props as {
    errors: Partial<Record<keyof ProjectFormValues, string>>;
  };

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
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
    router.post(route("project.store"), data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Add Project</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>Fill in the project details and click save.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} placeholder="Type project name here." />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Type project description here." />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
