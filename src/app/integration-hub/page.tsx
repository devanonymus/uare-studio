import Link from "next/link";
import {
  ArrowLeft,
  LayoutGrid,
  LockKeyhole,
  Plug,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { IntegrationHub } from "@/components/integrations/IntegrationHub";

export default async function IntegrationHubPage({
  searchParams,
}: {
  searchParams: Promise<{
    businessId?: string;
  }>;
}) {
  const params =
    await searchParams;

  const businessId =
    params.businessId ||
    "001c6d9e-f2a6-429e-8d46-898a7229c5ab";

  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      <AppSidebar />

      <div className="lg:ml-[112px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07111F]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[84px] max-w-[1580px] items-center justify-between gap-5 px-5 lg:px-8 xl:px-10">
            <div className="flex items-center gap-4">
              <Link
                href={`/automation-center?businessId=${businessId}`}
                className="flex size-11 items-center justify-center rounded-[12px] border border-white/[0.1] bg-white/[0.035]"
              >
                <ArrowLeft size={17} />
              </Link>

              <span className="flex size-11 items-center justify-center rounded-[12px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
                <Plug size={18} />
              </span>

              <div>
                <h1 className="text-lg font-semibold">
                  Integration Hub
                </h1>

                <p className="mt-1 text-sm text-[#B8C5D4]">
                  Servizi esterni, permessi e sicurezza.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="inline-flex items-center gap-2 text-sm text-[#B8C5D4]">
                <LockKeyhole
                  size={14}
                  className="text-[#24D27C]"
                />
                Secret server-side
              </span>

              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold"
              >
                <LayoutGrid size={15} />
                Mission Control
              </Link>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-24 pt-8 lg:px-8 xl:px-10">
          <div className="relative mx-auto max-w-[1580px]">
            <section className="mb-6 rounded-[22px] border border-white/[0.09] bg-[#0B1628] p-7 md:p-9">
              <div className="flex items-start gap-4">
                <ShieldCheck
                  size={22}
                  className="mt-1 shrink-0 text-[#24D27C]"
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                    Secure integration layer
                  </p>

                  <h2 className="mt-4 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-0.04em] md:text-5xl">
                    UVIQ può operare fuori dal sistema
                    <span className="block text-[#FF6B1A]">
                      solo con permessi espliciti.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-4xl text-base leading-8 text-[#CBD6E2]">
                    Ogni provider avrà un adapter indipendente, permessi
                    minimi, test reali, limiti operativi e audit completo.
                  </p>
                </div>
              </div>
            </section>

            <IntegrationHub
              businessId={businessId}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
