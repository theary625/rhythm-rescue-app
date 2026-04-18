import { createFileRoute } from "@tanstack/react-router";
import { REVERSIBLE_CAUSES } from "@/lib/acls-data";

export const Route = createFileRoute("/reference")({
  component: Reference,
  head: () => ({
    meta: [
      { title: "ACLS Reference — Doses, H's & T's · CodeBlue" },
      {
        name: "description",
        content:
          "Quick reference: ACLS drug doses, defibrillation energies, reversible causes (H's & T's), and high-quality CPR targets.",
      },
    ],
  }),
});

const DOSES = [
  { drug: "Epinephrine", indication: "Cardiac arrest", dose: "1 mg IV/IO every 3–5 min" },
  { drug: "Epinephrine (infusion)", indication: "Post-ROSC hypotension", dose: "0.1–0.5 mcg/kg/min" },
  { drug: "Amiodarone", indication: "VF/pVT refractory to defib", dose: "300 mg IV/IO bolus, then 150 mg" },
  { drug: "Lidocaine", indication: "Alt to amiodarone in VF/pVT", dose: "1–1.5 mg/kg, then 0.5–0.75 mg/kg" },
  { drug: "Atropine", indication: "Symptomatic bradycardia", dose: "1 mg IV q3–5 min, max 3 mg" },
  { drug: "Adenosine", indication: "Stable narrow regular tachy", dose: "6 mg IV push, then 12 mg" },
  { drug: "Magnesium sulfate", indication: "Torsades de pointes", dose: "1–2 g IV diluted" },
  { drug: "Dopamine", indication: "Brady / post-ROSC", dose: "5–20 mcg/kg/min" },
  { drug: "Norepinephrine", indication: "Post-ROSC hypotension", dose: "0.1–0.5 mcg/kg/min" },
  { drug: "Aspirin", indication: "Suspected ACS", dose: "162–325 mg chewed" },
];

const SHOCKS = [
  { type: "Defibrillation (VF/pVT)", energy: "Biphasic 120–200 J · Monophasic 360 J" },
  { type: "Cardioversion · narrow regular", energy: "50–100 J synchronized" },
  { type: "Cardioversion · narrow irregular (A-fib)", energy: "120–200 J biphasic" },
  { type: "Cardioversion · wide regular (VT w/ pulse)", energy: "100 J synchronized" },
  { type: "Cardioversion · wide irregular (polymorphic VT)", energy: "Defib dose · NOT synchronized" },
];

function Reference() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Quick Reference
        </div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Doses, energies & reversible causes
        </h1>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-bold">High-quality CPR</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Rate", v: "100–120 / min" },
            { k: "Depth", v: "5–6 cm (2–2.4 in)" },
            { k: "Recoil", v: "Full chest recoil" },
            { k: "Interruptions", v: "< 10 sec" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {s.k}
              </div>
              <div className="mt-1 text-xl font-bold">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Drug doses</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Drug</th>
                <th className="px-4 py-3 text-left">Indication</th>
                <th className="px-4 py-3 text-left">Dose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DOSES.map((d) => (
                <tr key={d.drug} className="hover:bg-accent/40">
                  <td className="px-4 py-3 font-bold">{d.drug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.indication}</td>
                  <td className="px-4 py-3 font-mono text-meds">{d.dose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Defibrillation & cardioversion</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SHOCKS.map((s) => (
            <li
              key={s.type}
              className="rounded-xl border border-shock/40 bg-shock/10 p-4"
            >
              <div className="text-sm font-bold">{s.type}</div>
              <div className="mt-1 font-mono text-sm text-shock-foreground">{s.energy}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Reversible causes — H's & T's</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {REVERSIBLE_CAUSES.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-card"
            >
              <span
                className={
                  "flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-bold " +
                  (c.letter === "H"
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive")
                }
              >
                {c.letter}
              </span>
              <span className="font-medium">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="rounded-2xl border border-border bg-muted/40 p-5 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">For training & reference only.</strong> Verify all doses
        and decisions against current AHA guidelines and your institutional protocols.
      </footer>
    </main>
  );
}
