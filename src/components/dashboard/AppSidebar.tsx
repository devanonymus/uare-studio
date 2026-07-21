"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
  WandSparkles,
} from "lucide-react";
import { GlobalCommand } from "@/components/navigation/GlobalCommand";

const navigation = [
  {
    label: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Progetti",
    href: "/audits",
    icon: BriefcaseBusiness,
  },
  {
    label: "Report",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Demo",
    href: "/demo-generator",
    icon: WandSparkles,
  },
  {
    label: "Strategia",
    href: "/growth-plan",
    icon: BarChart3,
  },
  {
    label: "Clienti",
    href: "/clients",
    icon: Users,
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function MiniLogo() {
  return (
    <div className="uviq-mini-logo">
      <span>U</span>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[112px] p-4 lg:block">
        <div className="workspace-dock flex h-full flex-col items-center rounded-[30px] px-3 py-4">
          <Link
            href="/"
            aria-label="UVIQ Home"
            className="flex size-14 items-center justify-center rounded-[20px] border border-white/[0.08] bg-white/[0.035]"
          >
            <MiniLogo />
          </Link>

          <Link
            href="/projects/new"
            aria-label="Nuovo progetto"
            className="uviq-dock-create mt-5 flex size-12 items-center justify-center rounded-[18px] text-white"
          >
            <Plus size={19} strokeWidth={2} />
          </Link>

          <nav className="mt-6 flex flex-1 flex-col items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`uviq-dock-link group relative flex size-12 items-center justify-center rounded-[17px] ${
                    active ? "is-active" : ""
                  }`}
                >
                  {active && (
                    <span className="uviq-active-indicator" />
                  )}

                  <Icon size={18} strokeWidth={1.55} />

                  <span className="uviq-tooltip">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col items-center gap-2">
            <GlobalCommand compact />

            <Link
              href="/settings"
              title="Impostazioni"
              className={`uviq-dock-link flex size-12 items-center justify-center rounded-[17px] ${
                pathname.startsWith("/settings") ? "is-active" : ""
              }`}
            >
              <Settings size={18} strokeWidth={1.55} />
            </Link>

            <div className="uviq-avatar mt-2">
              <div>BL</div>
            </div>
          </div>
        </div>
      </aside>

      <header className="workspace-mobile-header sticky top-0 z-50 flex items-center justify-between px-4 py-3 lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <MiniLogo />

          <span className="text-lg font-semibold tracking-[-0.05em]">
            UVIQ
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <GlobalCommand compact />

          <Link
            href="/projects/new"
            aria-label="Nuovo progetto"
            className="uviq-dock-create flex size-10 items-center justify-center rounded-[15px] text-white"
          >
            <Plus size={17} />
          </Link>
        </div>
      </header>

      <nav className="workspace-mobile-nav fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-[22px] p-2 lg:hidden">
        {navigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`uviq-mobile-link flex size-11 items-center justify-center rounded-[15px] ${
                active ? "is-active" : ""
              }`}
            >
              <Icon size={17} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
