import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoginPage, setIsLoginPage] = useState(false);

  return (
    <div className="grid min-h-screen overflow-y-hidden grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span>CLT Toolbox.</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {
              isLoginPage ? (
                <LoginForm setIsLoginPage={setIsLoginPage} />
              ) : (
                <RegisterForm setIsLoginPage={setIsLoginPage} />
              )
            }
          </div>
        </div>
      </div>

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
