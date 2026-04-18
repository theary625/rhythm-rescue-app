import { createFileRoute } from "@tanstack/react-router";
import { AlgorithmGrid } from "@/components/algorithm-grid";

export const Route = createFileRoute("/algorithms/")({
  component: AlgorithmsIndex,
  head: () => ({
    meta: [
      { title: "ACLS Algorithms — CodeBlue" },
      {
        name: "description",
        content:
          "Browse AHA-aligned ACLS algorithms: cardiac arrest, bradycardia, tachycardia, post-ROSC care, ACS, and stroke.",
      },
    ],
  }),
});

function AlgorithmsIndex() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Reference
        </div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">ACLS Algorithms</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Tap any algorithm to step through actions, drug doses, and decision branches.
        </p>
      </div>
      <AlgorithmGrid />
    </main>
  );
}
