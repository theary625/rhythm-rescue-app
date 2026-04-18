import { createFileRoute, Link } from "@tanstack/react-router";
import { ScreenShell } from "@/components/ScreenShell";

export const Route = createFileRoute("/code")({
  head: () => ({
    meta: [
      { title: "Code — MedNurse CodeAssist" },
      { name: "description", content: "Active code screen." },
    ],
  }),
  component: CodeScreen,
});

function CodeScreen() {
  return (
    <ScreenShell>
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col items-center justify-center text-center">
        <p className="text-xl font-semibold text-brand-white">
          Code screen — built in Pass 2.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center text-sm font-semibold text-brand-softblue hover:text-brand-white"
        >
          ← Return home
        </Link>
      </div>
    </ScreenShell>
  );
}
