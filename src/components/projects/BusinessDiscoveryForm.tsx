"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Globe2,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import type {
  SectorConversionGoal,
  SectorId,
} from "@/core/sectors/types";

type SerializableSector = {
  id: SectorId;
  name: string;
  description: string;
  conversionGoals: SectorConversionGoal[];
};

type BusinessDiscoveryFormProps = {
  sector: SerializableSector;
};

export function BusinessDiscoveryForm({
  sector,
}: BusinessDiscoveryFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    businessName: "",
    website: "",
    city: "",
    contactName: "",
    target: "",
    objective: sector.conversionGoals[0]?.label ?? "",
    notes: "",
  });

  function update(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      sectorId: sector.id,
      sectorName: sector.name,
      createdAt: new Date().toISOString(),
      ...form,
    };

    window.localStorage.setItem(
      "uviq-business-discovery",
      JSON.stringify(payload),
    );

    router.push(`/audits/new?sector=${sector.id}`);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-6 md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Nome dell’attività"
          icon={Building2}
          required
        >
          <input
            required
            value={form.businessName}
            onChange={(event) =>
              update("businessName", event.target.value)
            }
            placeholder="Es. Studio Alfa Srl"
            className="w-full px-4"
          />
        </Field>

        <Field label="Sito web" icon={Globe2}>
          <input
            type="url"
            value={form.website}
            onChange={(event) =>
              update("website", event.target.value)
            }
            placeholder="https://azienda.it"
            className="w-full px-4"
          />
        </Field>

        <Field
          label="Città o area commerciale"
          icon={MapPin}
        >
          <input
            value={form.city}
            onChange={(event) =>
              update("city", event.target.value)
            }
            placeholder="Es. Taranto e provincia"
            className="w-full px-4"
          />
        </Field>

        <Field label="Referente" icon={Users}>
          <input
            value={form.contactName}
            onChange={(event) =>
              update("contactName", event.target.value)
            }
            placeholder="Nome del referente"
            className="w-full px-4"
          />
        </Field>

        <Field label="Target principale" icon={Users}>
          <input
            value={form.target}
            onChange={(event) =>
              update("target", event.target.value)
            }
            placeholder="Clienti ideali dell’attività"
            className="w-full px-4"
          />
        </Field>

        <Field
          label="Obiettivo prioritario"
          icon={Target}
        >
          <select
            value={form.objective}
            onChange={(event) =>
              update("objective", event.target.value)
            }
            className="w-full px-4"
          >
            {sector.conversionGoals.map((goal) => (
              <option key={goal.id} value={goal.label}>
                {goal.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6">
        <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A97A8]">
          Contesto e informazioni utili
        </label>

        <textarea
          rows={5}
          value={form.notes}
          onChange={(event) =>
            update("notes", event.target.value)
          }
          placeholder="Problemi percepiti, richieste del cliente, servizi già utilizzati, obiettivi commerciali..."
          className="mt-3 w-full resize-none px-4 py-3"
        />
      </div>

      <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
        <p className="max-w-xl text-[10px] leading-5 text-[#8A97A8]">
          Le informazioni verranno salvate localmente e utilizzate per
          configurare il primo ciclo di intelligence.
        </p>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-3 rounded-[12px] bg-[#5B7CFF] px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-[#6C8AFF]"
        >
          Avvia intelligence
          <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: typeof Building2;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A97A8]">
        <Icon size={13} />
        {label}
        {required && (
          <span className="text-[#F05D6C]">*</span>
        )}
      </span>

      <span className="mt-3 block">
        {children}
      </span>
    </label>
  );
}
