import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Award, Download, RotateCcw } from "lucide-react";
import { getCase } from "@/lib/catalog";
import { useCertificate } from "@/lib/store";

export const Route = createFileRoute("/_app/case/$caseId/certificate")({
  head: ({ params }) => ({
    meta: [
      { title: `Case ${params.caseId} — Certificate | DOSSIER X` },
      { name: "description", content: `Case-closed certificate for DOSSIER X case ${params.caseId}.` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  const { caseId } = Route.useParams();
  const c = getCase(caseId);
  const cert = useCertificate(c?.packId);
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#f4ecd8" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`DOSSIER-X-${c?.code ?? "CASE"}-Certificate.pdf`);
    } finally {
      setBusy(false);
    }
  };

  if (!c) return <div className="p-10">Case not found.</div>;
  if (!cert) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-20 text-center">
        <Award className="h-10 w-10 text-gold mx-auto mb-4" />
        <h1 className="font-display text-3xl uppercase tracking-widest text-gold-gradient">
          No certificate yet
        </h1>
        <p className="mt-3 text-muted-foreground">
          Submit your final report to earn the certificate for {c.code} — {c.title}.
        </p>
        <Link
          to="/case/$caseId/submit"
          params={{ caseId }}
          className="mt-6 inline-block rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2 text-sm font-semibold uppercase tracking-widest text-background"
        >
          Submit Investigation
        </Link>
      </div>
    );
  }

  const date = new Date(cert.date).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 py-6 sm:py-10">
      <Link to="/case/$caseId" params={{ caseId }} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to case file
      </Link>

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="font-display text-3xl uppercase tracking-widest text-gold-gradient">
          Certificate of Investigation
        </h1>
        <div className="flex gap-2">
          <Link
            to="/case/$caseId/submit"
            params={{ caseId }}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-xs uppercase tracking-widest hover:text-gold"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retake
          </Link>
          <button
            onClick={download}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2 text-xs font-semibold uppercase tracking-widest text-background disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="relative mx-auto aspect-[1.414/1] w-full max-w-[1000px] rounded-lg overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #f4ecd8 0%, #e8dcc0 60%, #d9c9a3 100%)",
        }}
      >
        {/* Border */}
        <div className="absolute inset-4 border-4 border-double" style={{ borderColor: "#8a6b1f" }} />
        <div className="absolute inset-6 border" style={{ borderColor: "#8a6b1f" }} />

        {/* Corner ornaments */}
        {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((p) => (
          <div key={p} className={`absolute ${p} w-10 h-10`}>
            <div className="w-full h-full rounded-full border-2" style={{ borderColor: "#8a6b1f" }} />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-16 text-center" style={{ color: "#3a2b12" }}>
          <div className="font-display text-3xl tracking-[0.35em]">DOSSIER X</div>
          <div className="text-[10px] uppercase tracking-[0.4em] mt-1 opacity-70">
            Special Investigation Division
          </div>

          <div className="mt-8 text-sm uppercase tracking-[0.3em] opacity-80">
            Certificate of Investigation
          </div>
          <div className="mt-6 text-xs uppercase tracking-widest opacity-70">
            This is to certify that
          </div>
          <div className="mt-2 font-display text-5xl tracking-wide" style={{ color: "#5a3f0e" }}>
            {cert.detectiveName}
          </div>
          <div className="mt-4 text-xs uppercase tracking-widest opacity-70 max-w-xl">
            has successfully completed the investigation of
          </div>
          <div className="mt-2 font-display text-2xl uppercase tracking-wider">
            {cert.caseTitle}
          </div>
          <div className="mt-1 font-mono text-xs opacity-70">Case № {cert.caseId}</div>

          <div className="mt-8 flex gap-16">
            <Stat label="Score" value={`${cert.percent}%`} />
            <Stat label="Rank" value={cert.rank} />
            <Stat label="Date" value={date} />
          </div>

          <div className="mt-10 flex items-center gap-8">
            <div className="text-center">
              <div className="w-40 border-b" style={{ borderColor: "#8a6b1f" }} />
              <div className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Chief Investigator</div>
            </div>
            <div className="grid place-items-center">
              <div className="stamp text-sm rotate-[-8deg]">Case Closed</div>
            </div>
            <div className="text-center">
              <div className="w-40 border-b" style={{ borderColor: "#8a6b1f" }} />
              <div className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Date Issued</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest opacity-70">{label}</div>
      <div className="mt-1 font-display text-xl" style={{ color: "#5a3f0e" }}>{value}</div>
    </div>
  );
}
