"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  FileChartColumn,
  Globe2,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { GlobalCommand } from "@/components/navigation/GlobalCommand";

const navigation = [
  {
    section: "Workspace",
    items: [
      {
        label: "Intelligence",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Progetti",
        href: "/audits",
        icon: BriefcaseBusiness,
        badge: "5",
      },
      {
        label: "Report",
        href: "/reports",
        icon: FileChartColumn,
        badge: "3",
      },
    ],
  },
  {
    section: "Strategia",
    items: [
      {
        label: "Growth Plan",
        href: "/growth-plan",
        icon: Target,
      },
      {
        label: "Demo Generator",
        href: "/demo-generator",
        icon: Globe2,
        badge: "AI",
      },
      {
        label: "Clienti",
        href: "/clients",
        icon: Users,
      },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname.startsWith(href);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.055] bg-[#080809]/92 px-4 py-5 backdrop-blur-3xl lg:flex lg:flex-col">
        <div className="flex items-center justify-between px-2">
          <BrandMark compact showDescriptor={false} />
          <GlobalCommand compact />
        </div>

        <Link
          href="/projects/new"
          className="group mt-7 flex items-center justify-between rounded-[18px] bg-[#d2aa62] px-4 py-3.5 text-xs font-medium text-[#171008] transition hover:bg-[#e5c47e]"
        >
          <span className="inline-flex items-center gap-3">
            <Plus size={16} strokeWidth={1.8} />
            Nuovo progetto
          </span>

          <Sparkles
            size={14}
            className="transition group-hover:rotate-12 group-hover:scale-110"
          />
        </Link>

        <div className="mt-7 space-y-7">
          {navigation.map((group) => (
            <section key={group.section}>
              <p className="mb-2 px-3 text-[8px] uppercase tracking-[0.28em] text-white/19">
                {group.section}
              </p>

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-[16px] px-3 py-3 text-[13px] transition ${
                        active
                          ? "bg-white/[0.065] text-white/88"
                          : "text-white/37 hover:bg-white/[0.035] hover:text-white/72"
                      }`}
                    >
                      <span
                        className={`flex size-8 items-center justify-center rounded-xl transition ${
                          active
                            ? "bg-[#d1aa62]/10 text-[#dfbd78]"
                            : "text-white/27 group-hover:text-white/58"
                        }`}
                      >
                        <Icon size={16} strokeWidth={1.45} />
                      </span>

                      <span className="flex-1">{item.label}</span>

                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-1 text-[7px] uppercase tracking-[0.12em] ${
                            active
                              ? "bg-[#d1aa62]/10 text-[#dfbd78]"
                              : "bg-white/[0.04] text-white/23"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </section>
          ))}
        </div>

        <div className="mt-auto">
          <div className="rounded-[20px] border border-white/[0.055] bg-white/[0.018] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d2aa62] to-[#7e5626] text-xs font-semibold text-black">
                BL
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white/66">
                  Brian Laddomada
                </p>

                <p className="mt-1 truncate text-[8px] uppercase tracking-[0.13em] text-white/20">
                  Strategy Director
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="mt-4 flex items-center gap-3 border-t border-white/[0.05] pt-4 text-[10px] text-white/27 transition hover:text-white/65"
            >
              <Settings size={14} />
              Impostazioni workspace
            </Link>
          </div>

          <p className="mt-4 px-2 text-[7px] uppercase tracking-[0.22em] text-white/13">
            UAE Intelligence · Univibe Group
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-[#080809]/88 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <BrandMark compact showDescriptor={false} />

        <div className="flex items-center gap-2">
          <GlobalCommand compact />

          <Link
            href="/projects/new"
            className="flex size-10 items-center justify-center rounded-full bg-[#d1aa62] text-[#171008]"
          >
            <Plus size={17} />
          </Link>
        </div>
      </header>
    </>
  );
}
