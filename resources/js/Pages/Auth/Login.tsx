import {LoginForm} from "@/components/auth/login-form";
import {GalleryVerticalEnd} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo / Branding */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span>Acme Inc.</span>
          </a>
        </div>

        {/* Login Form Centered */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://app.clttoolbox.com.au/images/login-bg.jpg"
          alt="Login background showing a workspace"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
