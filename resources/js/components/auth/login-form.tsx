import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";
import { useEffect } from "react";

// Zod schema for client-side validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginFormProps extends React.ComponentProps<"form"> {
  setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}
export function LoginForm({ className, setIsLoginPage, ...props }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });
  const { errors: serverErrors } = usePage().props as {
    errors: Partial<Record<keyof LoginFormValues, string>>;
  };

  useEffect(() => {
    if (serverErrors.email) {
      setError("email", { type: "server", message: serverErrors.email });
    }
    if (serverErrors.password) {
      setError("password", { type: "server", message: serverErrors.password });
    }
  }, [serverErrors, setError]);

  const onSubmit = (data: LoginFormValues) => {
    router.post(route("login"), data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="m@example.com" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a onClick={() => setIsLoginPage(false)} className="underline underline-offset-4 cursor-pointer">
          Register
        </a>
      </div>
    </form>
  );
}
