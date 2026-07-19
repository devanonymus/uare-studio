import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuickAuditForm } from "@/components/quick-audit/QuickAuditForm";

export default function NewAuditPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 md:px-10 md:py-10">
      <div className="noise" />

      <div className="mx-auto mb-8 max-w-6xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/27 transition hover:text-white/70"
        >
          <ArrowLeft size={14} />
          Intelligence Center
        </Link>
      </div>

      <QuickAuditForm />
    </main>
  );
}
