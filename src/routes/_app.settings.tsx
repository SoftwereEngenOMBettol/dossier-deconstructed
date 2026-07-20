import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProfile, defaultProfile } from "@/lib/session";
import { listCaseIds, removeCase } from "@/lib/store";
import { toast } from "sonner";
import { Trash2, User, LogOut } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { profile, setProfile, ready } = useProfile();
  const [name, setName] = useState("");
  const [owned, setOwned] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);
  useEffect(() => {
    listCaseIds().then(setOwned);
  }, []);

  if (!ready) return null;

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Name cannot be empty");
    setProfile({ ...(profile ?? defaultProfile(trimmed)), name: trimmed });
    toast.success("Profile updated");
  };

  const signOut = () => {
    setProfile(null);
    navigate({ to: "/" });
  };

  const wipeCase = async (id: string) => {
    await removeCase(id);
    setOwned((o) => o.filter((x) => x !== id));
    toast.success(`Removed ${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-8 py-6 sm:py-10">
      <h1 className="font-display text-4xl uppercase tracking-widest text-gold-gradient">
        Settings
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage your detective profile and imported cases.
      </p>

      <section className="mt-10 rounded-lg border border-border bg-card/60 p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
          <User className="h-4 w-4" /> Detective Profile
        </div>
        <label className="mt-4 block text-[10px] uppercase tracking-widest text-muted-foreground">
          Display Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
        <div className="mt-4 flex gap-3">
          <button
            onClick={save}
            className="rounded-md bg-gradient-to-b from-gold to-gold-deep px-4 py-2 text-xs font-semibold uppercase tracking-widest text-background"
          >
            Save
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-stamp-red hover:border-stamp-red/40 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card/60 p-6">
        <div className="text-xs uppercase tracking-widest text-gold">Imported Cases</div>
        {owned.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No cases imported yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {owned.map((id) => (
              <li key={id} className="flex items-center justify-between py-3">
                <span className="font-mono text-sm">{id}</span>
                <button
                  onClick={() => wipeCase(id)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-stamp-red transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
