import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <h1 className="mb-6 font-display text-2xl">Welcome back</h1>
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
