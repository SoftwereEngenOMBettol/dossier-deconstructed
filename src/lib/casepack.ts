import JSZip from "jszip";
import { normalizeCaseId, refreshOwned, saveCase, type StoredCase } from "./store";

const JSON_FILES = [
  "manifest",
  "case",
  "documents",
  "witnesses",
  "suspects",
  "evidence",
  "timeline",
  "crime_scene",
  "questions",
  "solution",
  "certificate",
  "achievements",
  "victim",
] as const;

const ASSET_EXT_MIME: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  pdf: "application/pdf",
  json: "application/json",
};

export async function importCasepackFromBlob(blob: Blob): Promise<StoredCase> {
  const zip = await JSZip.loadAsync(blob);

  const readJson = async (name: string): Promise<any> => {
    const file =
      zip.file(`${name}.json`) ??
      zip.file(new RegExp(`(^|/)${name}\\.json$`, "i"))[0];
    if (!file) return null;
    try {
      return JSON.parse(await file.async("string"));
    } catch {
      return null;
    }
  };

  const data: Record<string, any> = {};
  for (const key of JSON_FILES) data[key] = await readJson(key);

  if (!data.manifest?.id) {
    throw new Error("Invalid .casepack: missing manifest.json with an id");
  }

  // Materialize assets as blob URLs
  const assets: Record<string, string> = {};
  const assetPromises: Promise<void>[] = [];
  zip.forEach((path, entry) => {
    if (entry.dir) return;
    if (!path.startsWith("assets/")) return;
    const ext = path.split(".").pop()?.toLowerCase() ?? "";
    const mime = ASSET_EXT_MIME[ext] ?? "application/octet-stream";
    assetPromises.push(
      entry.async("blob").then((b) => {
        const typed = b.type ? b : new Blob([b], { type: mime });
        assets[path] = URL.createObjectURL(typed);
      }),
    );
  });
  await Promise.all(assetPromises);

  const stored: StoredCase = {
    id: normalizeCaseId(data.manifest.id),
    manifest: data.manifest,
    case: data.case ?? {},
    documents: data.documents ?? [],
    witnesses: data.witnesses ?? [],
    suspects: data.suspects ?? [],
    evidence: data.evidence ?? [],
    timeline: data.timeline ?? [],
    crime_scene: data.crime_scene ?? {},
    questions: data.questions ?? [],
    solution: data.solution ?? {},
    certificate: data.certificate ?? {},
    achievements: data.achievements ?? [],
    victim: data.victim ?? null,
    assets,
    importedAt: new Date().toISOString(),
  };

  await saveCase(stored);
  await refreshOwned();
  return stored;
}

export async function importCasepackFromFile(file: File) {
  return importCasepackFromBlob(file);
}

export async function importCasepackFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch casepack: ${res.status}`);
  return importCasepackFromBlob(await res.blob());
}

/** Resolve an in-casepack asset path against its blob-URL map. */
export function resolveAsset(assets: Record<string, string>, path?: string) {
  if (!path) return undefined;
  return assets[path] ?? assets[path.replace(/^\.\//, "")] ?? undefined;
}
