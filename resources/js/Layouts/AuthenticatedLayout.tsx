import {AppSidebar} from "@/components/app-sidebar";
import {SectionCards} from "@/components/section-cards";
import {SiteHeader} from "@/components/site-header";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {useAuthStore} from "@/stores/useAuthStore";
import {AuthProps} from "@/types/Auth";
import {router, usePage} from "@inertiajs/react";
import {PropsWithChildren, ReactNode, useEffect, useState} from "react";
import {set} from "react-hook-form";
import {toast} from "sonner";

type AuthenticatedLayoutProps = PropsWithChildren<{
  header?: ReactNode;
}>;

export default function AuthenticatedLayout({header, children}: AuthenticatedLayoutProps) {
  const {auth} = usePage<AuthProps>().props;
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(auth.user);
  }, [auth.user, setUser]);

  useEffect(() => {
    const unsubscribe = router.on("success", (event) => {
      const pageProps = event.detail.page.props as {
        flash?: {success?: string; error?: string};
      };

      const flash = pageProps.flash ?? {};

      if (flash.success) toast.success(flash.success);
      if (flash.error) toast.error(flash.error);
    });

    return unsubscribe;
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader header={header} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
