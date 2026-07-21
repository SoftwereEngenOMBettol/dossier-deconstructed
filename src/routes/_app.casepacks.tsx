import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Clock, FileArchive, Shield, ArrowLeft } from "lucide-react";
import { CATALOG, type CaseEntry } from "@/lib/catalog";

export const Route = createFileRoute("/_app/casepacks")({
  head: () => ({
    meta: [
      { title: "Casepacks — DOSSIER X" },
      {
        name: "description",
        content:
          "Download every DOSSIER X investigation as a .casepack file. Import them into the Archive to start playing.",
      },
      { property: "og:title", content: "Casepacks — DOSSIER X" },
      {
        property: "og:description",
        content:
          "Download every DOSSIER X investigation as a .casepack file. Import them into the Archive to start playing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CasepacksPage,
});

function CasepacksPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-8 py-6 sm:py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Archive
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-[0.12em] text-gold-gradient uppercase">
          Casepack Library
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Download any investigation as a <code className="text-gold">.casepack</code> file. Import the file through the Archive to unlock the case.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CATALOG.map((entry) => (
          <CasepackCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function CasepackCard({ entry }: { entry: CaseEntry }) {
  const url = `/casepacks/${entry.packId}.casepack`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition hover:border-gold/40 hover:shadow-gold">
      <div className="relative aspect-square overflow-hidden bg-surface">
        {entry.cover ? (
          <img
            src={entry.cover}
            alt={entry.title}
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:opacity-100 group-hover:scale-[1.02]"
            loading="lazy"
            width={1024}
            height={1024}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2">
            <span className="stamp text-sm">CLASSIFIED</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="rounded border border-gold/40 bg-background/80 px-2 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
            {entry.code}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-display text-xl text-gold-gradient">{entry.title}</h2>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{entry.tagline}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> Difficulty {entry.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {entry.playMinutes[0]}–{entry.playMinutes[1]} min
          </span>
          <span className="flex items-center gap-1">
            <FileArchive className="h-3 w-3" /> .casepack
          </span>
        </div>

        <a
          href={url}
          download={`${entry.packId}.casepack`}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-background hover:brightness-110 transition"
        >
          <Download className="h-4 w-4" /> Download Casepack
        </a>
      </div>
    </article>
  );
}
