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
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {router, usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import {route} from "ziggy-js";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "./ui/select";
import axios from "axios";
import {MaterialType, ProjectType, SupplierType} from "@/types/Project";

const projectSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  building_part_type: z.string().min(1, {message: "Building part type is required"}),
  material: z.string().min(1, {message: "Material is required"}),
  supplier_id: z.string().min(1, {message: "Supplier is required"}),
});

type MaterialFormValues = z.infer<typeof projectSchema>;

export default function AddMaterial({
  open,
  setOpen,
  initialValues,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: MaterialType;
}) {
  const {errors: serverErrors} = usePage().props as {
    errors: Partial<Record<keyof MaterialFormValues, string>>;
  };
  const [materialType, setMaterialType] = useState<{label: string; value: string}[]>([]);
  const [supplier, setSupplier] = useState<SupplierType[]>([]);
  const projectId = usePage<{project: ProjectType}>().props.project.id;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    setValue,
    formState: {errors},
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "all",
    defaultValues: {
      name: initialValues?.name || "",
      building_part_type: initialValues?.building_part_type || "",
      material: initialValues?.material || "",
      supplier_id: initialValues?.supplier_id?.toString() || "",
    },
  });

  const buildingPartType = watch("building_part_type");
  const selectedMaterial = watch("material");

  useEffect(() => {
    if (buildingPartType) {
      axios
        .get(`/api/material-types?partType=${buildingPartType}`)
        .then((response) => {
          setMaterialType(response.data);
        })
        .catch((error) => {
          console.error("Error fetching material types:", error);
        });
    }
  }, [buildingPartType]);

  useEffect(() => {
    if (selectedMaterial) {
      axios
        .get(`/api/supplier-materials?type=${selectedMaterial}`)
        .then((response) => {
          setSupplier(response.data);
        })
        .catch((error) => {
          console.error("Error fetching suppliers:", error);
        });
    }
  }, [selectedMaterial]);

  useEffect(() => {
    Object.entries(serverErrors).forEach(([key, message]) => {
      setError(key as keyof MaterialFormValues, {type: "server", message});
    });
  }, [serverErrors, setError]);

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || "",
        building_part_type: initialValues.building_part_type || "",
        material: initialValues.material || "",
        supplier_id: initialValues.supplier_id?.toString() || "",
      });
    }
  }, [initialValues, reset]);

  const onSubmit = (data: MaterialFormValues) => {
    if (initialValues) {
      router.put(route("project.material.update", {project: projectId, material: initialValues.id}), data, {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      });
    } else {
      router.post(route("project.material.store", {project: projectId}), data, {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{initialValues ? "Edit" : "Add"} Material</DialogTitle>
            <DialogDescription>Fill in the material details and click save.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} placeholder="Type project name here." />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="building_part_type">Building Part Type</Label>
              <Select onValueChange={(value) => setValue("building_part_type", value)} value={buildingPartType || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Building Parts</SelectLabel>
                    <SelectItem value="floor">Floor</SelectItem>
                    <SelectItem value="wall">Wall</SelectItem>
                    <SelectItem value="beam">Beam</SelectItem>
                    <SelectItem value="column">Column</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.building_part_type && <p className="text-sm text-red-500">{errors.building_part_type.message}</p>}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="material">Material</Label>
              <Select onValueChange={(value) => setValue("material", value)} value={selectedMaterial || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Material</SelectLabel>
                    {materialType.map((material) => (
                      <SelectItem key={material.value} value={material.value}>
                        {material.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.material && <p className="text-sm text-red-500">{errors.material.message}</p>}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="supplier">Supplier</Label>
              <Select onValueChange={(value) => setValue("supplier_id", value)} value={watch("supplier_id") || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Supplier</SelectLabel>
                    {supplier.map((sup) => (
                      <SelectItem key={sup.id} value={sup.id.toString()}>
                        {sup.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.supplier_id && <p className="text-sm text-red-500">{errors.supplier_id.message}</p>}
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
