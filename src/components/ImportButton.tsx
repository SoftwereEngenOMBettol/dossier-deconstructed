import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { importCasepackFromFile, importCasepackFromUrl } from "@/lib/casepack";
import { toast } from "sonner";

export function ImportButton({
  className = "",
  demoUrl,
}: {
  className?: string;
  demoUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const s = await importCasepackFromFile(file);
      toast.success(`Imported ${s.manifest.title ?? s.id}`, {
        description: "The case is unlocked and ready to investigate.",
      });
    } catch (e: any) {
      toast.error("Import failed", { description: e?.message ?? String(e) });
    } finally {
      setBusy(false);
    }
  };

  const handleDemo = async () => {
    if (!demoUrl) return;
    setBusy(true);
    try {
      const s = await importCasepackFromUrl(demoUrl);
      toast.success(`Loaded demo: ${s.manifest.title ?? s.id}`);
    } catch (e: any) {
      toast.error("Failed to load demo", { description: e?.message ?? String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept=".casepack,.zip,application/zip"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2 text-xs font-semibold uppercase tracking-widest text-background hover:brightness-110 transition disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        Import Investigation
      </button>
      {demoUrl && (
        <button
          onClick={handleDemo}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold hover:border-gold/40 transition"
        >
          Load Demo Case
        </button>
      )}
    </div>
  );
}
