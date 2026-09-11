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
    <div className="flex flex-1 justify-center bg-background h-full">
      <div className="flex w-full flex-col border-x border-border bg-background h-full overflow-hidden md:max-w-2xl">
        <header className="flex items-center justify-between px-5 py-4 flex-shrink-0">
          <Logo className="text-xl" />
          <LogoutButton />
        </header>
        <main className="flex-1 px-5 pb-6 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
