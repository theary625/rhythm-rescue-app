import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenShell } from "@/components/ScreenShell";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Quick reference — MedNurse CodeAssist" },
      {
        name: "description",
        content: "AHA-aligned reference cards for BLS, ACLS, and PALS.",
      },
    ],
  }),
  component: ReferenceScreen,
});

function ReferenceScreen() {
  return (
    <ScreenShell>
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-brand-white">
          Quick reference
        </h1>
        <p className="mt-4 text-base text-brand-white/70">
          AHA-aligned reference cards for BLS, ACLS, and PALS. Coming next.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center text-sm font-semibold text-brand-softblue hover:text-brand-white"
        >
          ← Return home
        </Link>
      </div>
    </ScreenShell>
  );
}
