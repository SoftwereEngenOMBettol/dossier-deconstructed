import { Link, useLocation } from "@tanstack/react-router";
import {
  FolderOpen,
  Camera,
  Archive,
  Users,
  UserCheck,
  Clock,
  Notebook,
  HelpCircle,
  FileCheck,
  Award,
  Trophy,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "@/assets/dx-logo.png";
import type { DetectiveProfile } from "@/lib/session";

const NAV_INVESTIGATION = [
  { label: "Case File", icon: FolderOpen, href: "/case/dx-001" },
  { label: "Crime Scene", icon: Camera, href: "/case/dx-001/crime-scene" },
  { label: "Evidence Locker", icon: Archive, href: "/case/dx-001/evidence" },
  { label: "Suspects", icon: Users, href: "/case/dx-001/suspects" },
  { label: "Witnesses", icon: UserCheck, href: "/case/dx-001/witnesses" },
  { label: "Timeline", icon: Clock, href: "/case/dx-001/timeline" },
  { label: "My Notebook", icon: Notebook, href: "/case/dx-001/notebook" },
  { label: "Questions", icon: HelpCircle, href: "/case/dx-001/questions" },
  { label: "Final Report", icon: FileCheck, href: "/case/dx-001/final-report" },
];

const NAV_ACHIEVEMENTS = [
  { label: "Certificates", icon: Award, href: "/certificates" },
  { label: "Achievements", icon: Trophy, href: "/achievements" },
];

interface Props {
  profile: DetectiveProfile;
  onLogout?: () => void;
}

export function AppSidebar({ profile, onLogout }: Props) {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-border bg-sidebar/95 backdrop-blur">
      {/* Brand */}
      <Link to="/archive" className="flex items-center gap-3 px-6 pt-6 pb-4">
        <img src={logo} alt="Dossier X" className="h-14 w-14 object-contain" />
        <div>
          <div className="font-display text-xl tracking-widest text-gold-gradient">DOSSIER X</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Truth hides in the details.
          </div>
        </div>
      </Link>

      <div className="h-px bg-border mx-6 my-2" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <NavSection title="Investigation" items={NAV_INVESTIGATION} pathname={pathname} />
        <NavSection title="Achievements" items={NAV_ACHIEVEMENTS} pathname={pathname} />
        <NavSection
          title=""
          items={[{ label: "Settings", icon: Settings, href: "/settings" }]}
          pathname={pathname}
        />
      </nav>

      {/* Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-gold-deep to-surface-2 grid place-items-center font-display text-lg text-background">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-sm">{profile.name}</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
              {profile.rank}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>Level {profile.level}</span>
          <span>
            {profile.xp} / {profile.xpToNext} XP
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-deep to-gold"
            style={{ width: `${(profile.xp / profile.xpToNext) * 100}%` }}
          />
        </div>

        <button
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface/50 px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold hover:border-gold/50 transition"
        >
          <LogOut className="h-3.5 w-3.5" /> Log out
        </button>
      </div>
    </aside>
  );
}

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: { label: string; icon: React.ComponentType<{ className?: string }>; href: string }[];
  pathname: string;
}) {
  return (
    <div>
      {title && (
        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
          {title}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || (href !== "/archive" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                to={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-gold/10 text-gold border-l-2 border-gold pl-[10px]"
                    : "text-sidebar-foreground/80 hover:bg-surface/60 hover:text-gold border-l-2 border-transparent pl-[10px]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="uppercase tracking-widest text-[11px]">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
