"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  FileChartColumn,
  LayoutDashboard,
  Settings,
  Store,
} from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";

const navigation = [
  {
    label: "Panoramica",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Audit ristoranti",
    href: "/audits",
    icon: BriefcaseBusiness,
  },
  {
    label: "Clienti",
    href: "/clients",
    icon: Store,
  },
  {
    label: "Report",
    href: "/reports",
    icon: FileChartColumn,
  },
  {
    label: "Analisi strategica",
    href: "/dashboard#intelligence",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[276px] border-r border-white/[0.065] bg-black/65 px-6 py-8 backdrop-blur-3xl lg:flex lg:flex-col">
      <div className="flex justify-start">
        <BrandMark compact showDescriptor={false} />
      </div>

      <div className="mt-12">
        <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.34em] text-white/28">
          UARE Studio
        </p>

        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href.split("#")[0]);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-all duration-300 ${
                  active
                    ? "border-[#c7a05c]/25 bg-[#c7a05c]/10 text-[#f0d18e]"
                    : "border-transparent text-white/46 hover:border-white/7 hover:bg-white/[0.035] hover:text-white/85"
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.55}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/38 transition hover:bg-white/[0.035] hover:text-white/80"
        >
          <Settings size={17} strokeWidth={1.55} />
          Impostazioni
        </Link>

        <div className="mt-5 border-t border-white/[0.055] pt-5">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/22">
            Univibe Group
          </p>
          <p className="mt-1 text-[10px] text-white/35">
            Ambiente professionale · v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
