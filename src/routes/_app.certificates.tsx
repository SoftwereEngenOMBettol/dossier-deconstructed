import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Lock, Download } from "lucide-react";
import { CATALOG } from "@/lib/catalog";
import { listCertificates, type CertificateRecord } from "@/lib/store";

export const Route = createFileRoute("/_app/certificates")({
  component: CertificatesGallery,
});

function CertificatesGallery() {
  const [certs, setCerts] = useState<CertificateRecord[]>([]);
  useEffect(() => {
    listCertificates().then(setCerts);
  }, []);
  const byId = new Map(certs.map((c) => [c.caseId.toUpperCase(), c]));

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-8 py-6 sm:py-10">
      <h1 className="font-display text-4xl uppercase tracking-widest text-gold-gradient">
        Certificates
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every solved case earns a printable certificate — signed by the Bureau.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CATALOG.filter((c) => c.status !== "coming-soon").map((c) => {
          const rec = byId.get(c.packId.toUpperCase());
          return (
            <article
              key={c.id}
              className={`relative rounded-lg border overflow-hidden ${rec ? "border-gold/50 bg-card/70" : "border-border bg-card/40"}`}
            >
              <div className="paper p-6 min-h-[240px] relative">
                <div className="absolute top-3 right-3">
                  {rec ? (
                    <Award className="h-5 w-5 text-gold" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-[10px] font-mono tracking-widest text-paper-ink/60">
                  {c.code}
                </div>
                <div className="font-display text-xl uppercase tracking-wider text-paper-ink mt-1">
                  {c.title}
                </div>
                {rec ? (
                  <>
                    <div className="mt-6 text-[10px] uppercase tracking-widest text-paper-ink/60">
                      Awarded to
                    </div>
                    <div className="font-hand text-3xl text-paper-ink">
                      {rec.detectiveName}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-paper-ink/80">
                      <span className="uppercase tracking-widest">{rec.rank}</span>
                      <span className="font-mono">{rec.percent}%</span>
                    </div>
                    <div className="mt-1 text-[10px] text-paper-ink/60 font-mono">
                      {new Date(rec.date).toLocaleDateString()}
                    </div>
                  </>
                ) : (
                  <div className="mt-8 text-sm text-paper-ink/60 italic">
                    Locked. Solve the case to unlock this certificate.
                  </div>
                )}
              </div>
              {rec && (
                <Link
                  to="/case/$caseId/certificate"
                  params={{ caseId: c.id }}
                  className="flex items-center justify-center gap-2 border-t border-gold/30 bg-gold/10 py-3 text-xs uppercase tracking-widest text-gold hover:bg-gold/20 transition"
                >
                  <Download className="h-3.5 w-3.5" /> View & Download
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
