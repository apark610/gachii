import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default async function LandingPage() {
  const session = await getCurrentProfile();
  if (session?.user) {
    if (session.profile?.onboarded) {
      redirect("/app");
    } else {
      redirect("/onboarding");
    }
  }

  return <LandingPageContent />;
}

function LandingPageContent() {
  const stats = [
  { value: "74%", label: "felt more socially connected within their first month" },
  { value: "87%", label: "tried a new restaurant within their first two weeks" },
  { value: "70%", label: "felt less lonely just 21 days after downloading" },
];

const steps = [
  {
    title: "Share your food taste",
    body: "Tell us the cuisines, spots, and vibes you're into — no swiping through dating-app small talk.",
  },
  {
    title: "Match on compatibility",
    body: "We surface people nearby whose food taste actually overlaps with yours, with a taste-match score.",
  },
  {
    title: "Plan the meal together",
    body: "Pick from the restaurant you've had saved for months and lock in a time. Low-pressure, purely platonic.",
  },
];

  return (
    <div>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-10 text-center sm:pt-16">
        <span className="rounded-full bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary">
          For Social Foodies, by Social Foodies
        </span>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
          Find your food people, not a date.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Gachi matches you with compatible dining partners based on your food
          preferences — a low-pressure, platonic way to finally try the
          restaurants you&apos;ve been saving, with someone just as excited as
          you are.
        </p>
        <div className="mt-8">
          <Link
            href="/signup"
            className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Find your food people
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <p className="text-5xl text-primary sm:text-6xl" lang="ko">
          같이
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
          gachi &middot; Korean for <span className="italic normal-case tracking-normal">together</span>
        </p>
        <p className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
          Because the best meals are eaten together.
        </p>
      </section>

      <section className="border-y border-border bg-surface py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl text-primary">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-display text-3xl sm:text-4xl">
          How Gachi works
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-accent">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <blockquote className="font-display text-2xl leading-relaxed sm:text-3xl">
          One in four Americans now eats every meal alone — a 53% rise in
          twenty years. Sharing meals is as strongly tied to wellbeing as
          income.
        </blockquote>
        <p className="mt-4 text-sm text-muted">— World Happiness Report, 2025</p>
        <div className="mt-10">
          <Link
            href="/signup"
            className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Join Gachi — it&apos;s free
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted sm:flex-row">
          <Logo className="text-base" />
          <p>&copy; {new Date().getFullYear()} Gachi. Made for Social Foodies.</p>
        </div>
      </footer>
    </div>
  );
}
