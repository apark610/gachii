import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <h1 className="mb-2 font-display text-2xl">Find your food people</h1>
      <p className="mb-6 text-sm text-muted">Free to join, takes a minute.</p>
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
