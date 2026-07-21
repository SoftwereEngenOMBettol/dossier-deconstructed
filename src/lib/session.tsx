import { createContext, useContext, useEffect, useState } from "react";

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

interface ProfileContextValue {
  profile: DetectiveProfile | null;
  ready: boolean;
  setProfile: (p: DetectiveProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<DetectiveProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfileState(loadProfile());
    setReady(true);
  }, []);

  const setProfile = (p: DetectiveProfile | null) => {
    if (p) saveProfile(p);
    else clearProfile();
    setProfileState(p);
  };

  return (
    <ProfileContext.Provider value={{ profile, ready, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
