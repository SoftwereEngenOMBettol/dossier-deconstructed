import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy, Lock } from "lucide-react";
import { CATALOG } from "@/lib/catalog";
import { listCertificates, loadCase, type CertificateRecord } from "@/lib/store";

interface AchDisplay {
  caseId: string;
  caseTitle: string;
  code: string;
  items: { id: string; title: string; description?: string; unlocked: boolean }[];
}

export const Route = createFileRoute("/_app/achievements")({
  component: Achievements,
});

const DEFAULT_ACHIEVEMENTS = [
  { id: "solved", title: "Case Closed", description: "Solve the case." },
  { id: "perfect", title: "Perfect Deduction", description: "Score 100% on the final report." },
  { id: "collector", title: "Master Archivist", description: "Review every piece of evidence." },
];

function Achievements() {
  const [rows, setRows] = useState<AchDisplay[]>([]);

  useEffect(() => {
    (async () => {
      const certs = await listCertificates();
      const certById = new Map<string, CertificateRecord>(
        certs.map((c) => [c.caseId.toUpperCase(), c]),
      );
      const out: AchDisplay[] = [];
      for (const c of CATALOG) {
        if (c.status === "coming-soon") continue;
        const stored = await loadCase(c.packId);
        const cert = certById.get(c.packId.toUpperCase());
        const base = (stored?.achievements as any[]) ?? DEFAULT_ACHIEVEMENTS;
        const items = base.map((a: any) => {
          let unlocked = false;
          if (cert) {
            if (a.id === "solved") unlocked = true;
            else if (a.id === "perfect") unlocked = cert.percent >= 100;
            else unlocked = !!stored;
          }
          return { id: a.id, title: a.title ?? a.name ?? a.id, description: a.description, unlocked };
        });
        out.push({ caseId: c.id, code: c.code, caseTitle: c.title, items });
      }
      setRows(out);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-8 py-6 sm:py-10">
      <h1 className="font-display text-4xl uppercase tracking-widest text-gold-gradient">
        Achievements
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Rewards earned through thorough detective work.
      </p>

      <div className="mt-10 space-y-8">
        {rows.map((row) => (
          <section key={row.caseId} className="rounded-lg border border-border bg-card/60 p-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-gold">{row.code}</div>
                <div className="font-display text-lg uppercase tracking-wider">{row.caseTitle}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {row.items.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-md border p-4 ${a.unlocked ? "border-gold/50 bg-gold/5" : "border-border bg-surface/40"}`}
                >
                  <div className="flex items-center gap-2">
                    {a.unlocked ? (
                      <Trophy className="h-4 w-4 text-gold" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className={`text-sm font-semibold uppercase tracking-wider ${a.unlocked ? "text-gold" : "text-muted-foreground"}`}>
                      {a.title}
                    </div>
                  </div>
                  {a.description && (
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
