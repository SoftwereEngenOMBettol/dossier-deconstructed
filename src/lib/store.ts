import { get, set, del, keys } from "idb-keyval";
import { useEffect, useState, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
export function emitChange() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const CASE_PREFIX = "case:";
const NOTEBOOK_PREFIX = "notebook:";
const CERT_PREFIX = "cert:";

export interface StoredCase {
  id: string; // normalized id, e.g. "DX001"
  manifest: any;
  case: any;
  documents: any[];
  witnesses: any[];
  suspects: any[];
  evidence: any[];
  timeline: any[];
  crime_scene: any;
  questions: any[];
  solution: any;
  certificate: any;
  achievements?: any[];
  victim?: any;
  /** map of asset path (e.g. "assets/covers/cover.webp") -> blob URL */
  assets: Record<string, string>;
  importedAt: string;
}

export const normalizeCaseId = (id: string) =>
  id.replace(/[-_\s]/g, "").toUpperCase();

export async function saveCase(c: StoredCase) {
  await set(CASE_PREFIX + c.id, c);
  emitChange();
}
export async function loadCase(id: string): Promise<StoredCase | null> {
  return (await get(CASE_PREFIX + normalizeCaseId(id))) ?? null;
}
export async function removeCase(id: string) {
  await del(CASE_PREFIX + normalizeCaseId(id));
  emitChange();
}
export async function listCaseIds(): Promise<string[]> {
  const all = await keys();
  return all
    .filter((k) => typeof k === "string" && (k as string).startsWith(CASE_PREFIX))
    .map((k) => (k as string).slice(CASE_PREFIX.length));
}

/** Reactive hook: returns the imported case, or null while loading / not owned. */
export function useStoredCase(id: string | undefined) {
  const [c, setC] = useState<StoredCase | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    if (!id) {
      setC(null);
      setReady(true);
      return;
    }
    const refresh = () =>
      loadCase(id).then((v) => {
        if (alive) {
          setC(v);
          setReady(true);
        }
      });
    refresh();
    return subscribe(refresh) as any;
  }, [id]);
  return { case: c, ready };
}

export function useOwnedCaseIds() {
  return useSyncExternalStore(
    subscribe,
    () => ownedSnapshot,
    () => ownedSnapshot,
  );
}

let ownedSnapshot: string[] = [];
export async function refreshOwned() {
  ownedSnapshot = await listCaseIds();
  emitChange();
}
refreshOwned();

/* Notebook per case */
export function notebookKey(caseId: string) {
  return NOTEBOOK_PREFIX + normalizeCaseId(caseId);
}

/* Certificates */
export interface CertificateRecord {
  caseId: string;
  caseTitle: string;
  detectiveName: string;
  score: number;
  total: number;
  percent: number;
  rank: string;
  date: string;
  answers: Record<string, string>;
}
export async function saveCertificate(r: CertificateRecord) {
  await set(CERT_PREFIX + normalizeCaseId(r.caseId), r);
  emitChange();
}
export async function loadCertificate(caseId: string) {
  return ((await get(CERT_PREFIX + normalizeCaseId(caseId))) as CertificateRecord) ?? null;
}
export async function listCertificates(): Promise<CertificateRecord[]> {
  const all = await keys();
  const out: CertificateRecord[] = [];
  for (const k of all) {
    if (typeof k === "string" && k.startsWith(CERT_PREFIX)) {
      const v = (await get(k)) as CertificateRecord;
      if (v) out.push(v);
    }
  }
  return out;
}

export function useCertificate(caseId: string | undefined) {
  const [rec, setRec] = useState<CertificateRecord | null>(null);
  useEffect(() => {
    let alive = true;
    if (!caseId) return;
    const refresh = () =>
      loadCertificate(caseId).then((v) => alive && setRec(v));
    refresh();
    return subscribe(refresh) as any;
  }, [caseId]);
  return rec;
}
