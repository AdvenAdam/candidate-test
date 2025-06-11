import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { route } from "ziggy-js";
import { z } from "zod";
export interface RegisterFormProps extends React.ComponentProps<"form"> {
  setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

// Zod schema for client-side validation
const registerSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().nonempty({ message: "Email is required" }).email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;


export function RegisterForm({ className, setIsLoginPage, ...props }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "all",
  });
  const { errors: serverErrors } = usePage().props as {
    errors: Partial<Record<keyof RegisterFormValues, string>>;
  };
  console.log("🚀 ~ RegisterForm ~ errors:", errors)

  useEffect(() => {
    if (serverErrors.email) {
      setError("email", { type: "server", message: serverErrors.email });
    }
    if (serverErrors.password) {
      setError("password", { type: "server", message: serverErrors.password });
    }
    if (serverErrors.name) {
      setError("name", { type: "server", message: serverErrors.name });
    }
  }, [serverErrors, setError]);

  const onSubmit = (data: RegisterFormValues) => {
    router.post(route("register"), data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">Enter your email below to create new account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="John Doe" {...register("name")} required={true} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" {...register("email")} required />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} required />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        </div>
        <div className="grid gap-3">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input id="password_confirmation" type="password" {...register("password_confirmation")} required />
          {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>}

        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a onClick={() => setIsLoginPage(true)} className="underline underline-offset-4 cursor-pointer">
          Log In
        </a>
      </div>
    </form>
  );
}
