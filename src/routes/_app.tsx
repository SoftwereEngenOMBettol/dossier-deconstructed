import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { clearProfile, useProfile } from "@/lib/session";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const { profile, ready } = useProfile();

  useEffect(() => {
    if (ready && !profile) navigate({ to: "/", replace: true });
  }, [ready, profile, navigate]);

  if (!ready || !profile) {
    return <div className="h-screen" />;
  }

  return (
    <div className="flex min-h-screen md:h-screen md:overflow-hidden">
      <AppSidebar
        profile={profile}
        onLogout={() => {
          clearProfile();
          navigate({ to: "/", replace: true });
        }}
      />
      <div className="flex-1 md:overflow-y-auto texture-grain pt-14 md:pt-0 w-full min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
