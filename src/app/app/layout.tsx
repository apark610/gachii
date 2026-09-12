import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data";
import { Logo } from "@/components/Logo";
import { BottomNav } from "@/components/BottomNav";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentProfile();
  if (!session) redirect("/login");
  if (!session.profile?.onboarded) redirect("/onboarding");

  return (
    <div className="flex flex-1 justify-center bg-background min-h-screen">
      <div className="flex w-full flex-col bg-background min-h-screen md:max-w-2xl">
        <header className="flex items-center justify-between px-4 py-3 flex-shrink-0 sm:px-5 sm:py-4">
          <Logo className="text-lg sm:text-xl" />
          <LogoutButton />
        </header>
        <main className="flex-1 px-4 pb-20 overflow-y-auto sm:px-5 sm:pb-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
