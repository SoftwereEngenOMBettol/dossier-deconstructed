import { useEffect, useState } from "react";

export interface DetectiveProfile {
  name: string;
  rank: string;
  level: number;
  xp: number;
  xpToNext: number;
  createdAt: string;
}

const KEY = "dossier-x:profile";

export const defaultProfile = (name: string): DetectiveProfile => ({
  name,
  rank: "Junior Detective",
  level: 12,
  xp: 480,
  xpToNext: 1200,
  createdAt: new Date().toISOString(),
});

export function loadProfile(): DetectiveProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DetectiveProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: DetectiveProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

export function useProfile() {
  const [profile, setProfile] = useState<DetectiveProfile | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
  }, []);
  return {
    profile,
    ready,
    setProfile: (p: DetectiveProfile | null) => {
      if (p) saveProfile(p);
      else clearProfile();
      setProfile(p);
    },
  };
}
