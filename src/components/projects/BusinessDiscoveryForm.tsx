"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Circle,
  Globe2,
  LockKeyhole,
  MapPin,
  Radar,
  Sparkles,
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
  analysisAreas: Array<{
    id: string;
    label: string;
  }>;
  requiredFeatures: string[];
};

type BusinessDiscoveryFormProps = {
  sector: SerializableSector;
};

type FormState = {
  businessName: string;
  website: string;
  city: string;
  contactName: string;
  target: string;
  objective: string;
  notes: string;
};

const initialEmptyState = {
  businessName: "",
  website: "",
  city: "",
  contactName: "",
  target: "",
  notes: "",
};

export function BusinessDiscoveryForm({
  sector,
}: BusinessDiscoveryFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    ...initialEmptyState,
    objective: sector.conversionGoals[0]?.label ?? "",
  });

  const [error, setError] = useState("");

  const completion = useMemo(() => {
    const fields = [
      form.businessName,
      form.website,
      form.city,
      form.contactName,
      form.target,
      form.objective,
      form.notes,
    ];

    const completed = fields.filter(
      (value) => value.trim().length > 0,
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [form]);

  const assistantTasks = useMemo(
    () => [
      {
        label: "Riconoscimento settore",
        complete: true,
      },
      {
        label: "Identificazione attività",
        complete: form.businessName.trim().length >= 2,
      },
      {
        label: "Territorio commerciale",
        complete: form.city.trim().length >= 2,
      },
      {
        label: "Presenza digitale",
        complete: form.website.trim().length >= 4,
      },
      {
        label: "Analisi target",
        complete: form.target.trim().length >= 3,
      },
      {
        label: "Obiettivo di conversione",
        complete: form.objective.trim().length >= 2,
      },
    ],
    [form],
  );

  const completedTasks = assistantTasks.filter(
    (task) => task.complete,
  ).length;

  const estimatedMinutes = Math.max(
    1,
    4 - Math.floor(completion / 30),
  );

  function update(
    field: keyof FormState,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.businessName.trim().length < 2) {
      setError("Inserisci il nome dell’attività.");
      return;
    }

    if (form.city.trim().length < 2) {
      setError("Inserisci la città o l’area commerciale.");
      return;
    }

    const payload = {
      sectorId: sector.id,
      sectorName: sector.name,
      createdAt: new Date().toISOString(),
      completion: 100,
      ...form,
    };

    window.localStorage.setItem(
      "uviq-business-discovery",
      JSON.stringify(payload),
    );

    router.push(`/audits/new?sector=${sector.id}`);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Settore"
            value={sector.name}
            detail="Blueprint attivo"
            icon={Activity}
          />

          <Metric
            label="Aree intelligence"
            value={String(sector.analysisAreas.length)}
            detail="Moduli verticali"
            icon={Radar}
          />

          <Metric
            label="Funzioni richieste"
            value={String(sector.requiredFeatures.length)}
            detail="Capability previste"
            icon={Sparkles}
          />

          <Metric
            label="Profilo completato"
            value={`${completion}%`}
            detail={`${completedTasks}/${assistantTasks.length} controlli`}
            icon={CheckCircle2}
            progress={completion}
          />
        </section>

        <form
          onSubmit={submit}
          className="rounded-[18px] border border-white/[0.075] bg-[#11151C]"
        >
          <div className="border-b border-white/[0.07] px-6 py-5 md:px-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4FD1FF]">
              Informazioni principali
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#F5F7FA]">
              Profilo aziendale
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#8A97A8]">
              I dati alimentano il Business Twin e configurano gli
              agenti specializzati.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Nome dell’attività"
                icon={Building2}
                completed={form.businessName.trim().length >= 2}
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

              <Field
                label="Sito web"
                icon={Globe2}
                completed={form.website.trim().length >= 4}
              >
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
                completed={form.city.trim().length >= 2}
                required
              >
                <input
                  required
                  value={form.city}
                  onChange={(event) =>
                    update("city", event.target.value)
                  }
                  placeholder="Es. Taranto e provincia"
                  className="w-full px-4"
                />
              </Field>

              <Field
                label="Referente"
                icon={Users}
                completed={form.contactName.trim().length >= 2}
              >
                <input
                  value={form.contactName}
                  onChange={(event) =>
                    update("contactName", event.target.value)
                  }
                  placeholder="Nome del referente"
                  className="w-full px-4"
                />
              </Field>

              <Field
                label="Target principale"
                icon={Users}
                completed={form.target.trim().length >= 3}
              >
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
                completed={form.objective.trim().length >= 2}
              >
                <select
                  value={form.objective}
                  onChange={(event) =>
                    update("objective", event.target.value)
                  }
                  className="w-full px-4"
                >
                  {sector.conversionGoals.map((goal) => (
                    <option
                      key={goal.id}
                      value={goal.label}
                    >
                      {goal.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between gap-4">
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A97A8]">
                  Contesto e informazioni utili
                </label>

                <span className="text-[9px] text-[#5E6978]">
                  {form.notes.length}/1000
                </span>
              </div>

              <textarea
                rows={5}
                maxLength={1000}
                value={form.notes}
                onChange={(event) =>
                  update("notes", event.target.value)
                }
                placeholder="Problemi percepiti, richieste del cliente, servizi già utilizzati, budget e obiettivi commerciali..."
                className="mt-3 w-full resize-none px-4 py-3"
              />
            </div>

            {error && (
              <div className="mt-5 rounded-[12px] border border-[#F05D6C]/25 bg-[#F05D6C]/[0.07] px-4 py-3 text-xs text-[#FF9AA4]">
                {error}
              </div>
            )}
          </div>

          <footer className="flex flex-col justify-between gap-5 border-t border-white/[0.07] px-6 py-5 md:flex-row md:items-center md:px-8">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] border border-white/[0.07] bg-[#0E131B] text-[#8A97A8]">
                <LockKeyhole size={15} />
              </span>

              <p className="max-w-xl text-[10px] leading-5 text-[#8A97A8]">
                I dati vengono salvati nel workspace e utilizzati per
                configurare ricerca, analisi e automazioni.
              </p>
            </div>

            <button
              type="submit"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[12px] bg-[#5B7CFF] px-6 text-xs font-semibold text-white shadow-[0_12px_35px_rgba(91,124,255,0.24)] transition hover:bg-[#6C8AFF]"
            >
              Generate Business Intelligence
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </footer>
        </form>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <section className="overflow-hidden rounded-[18px] border border-white/[0.075] bg-[#11151C]">
          <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#8EA4FF]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A9B8FF]">
                UVIQ Assistant
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.05] px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#68E0C9]">
              <span className="size-1.5 rounded-full bg-[#2DD4BF]" />
              Live
            </span>
          </header>

          <div className="p-5">
            <div className="rounded-[14px] border border-white/[0.06] bg-[#0E131B] p-4">
              <p className="text-xs font-semibold text-[#F5F7FA]">
                {completion === 100
                  ? "Profilo pronto per l’analisi."
                  : "Sto configurando il Business Twin..."}
              </p>

              <p className="mt-2 text-[10px] leading-5 text-[#8A97A8]">
                Ogni informazione aumenta la precisione degli agenti
                strategici e operativi.
              </p>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[#5B7CFF] transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[8px]">
                <span className="text-[#5E6978]">
                  Completezza profilo
                </span>

                <span className="font-semibold text-[#A9B8FF]">
                  {completion}%
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-1">
              {assistantTasks.map((task) => (
                <div
                  key={task.label}
                  className="flex items-center gap-3 border-b border-white/[0.05] py-3 last:border-0"
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full border ${
                      task.complete
                        ? "border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.07] text-[#68E0C9]"
                        : "border-white/[0.08] text-[#5E6978]"
                    }`}
                  >
                    {task.complete ? (
                      <Check size={12} />
                    ) : (
                      <Circle size={8} />
                    )}
                  </span>

                  <span
                    className={`min-w-0 flex-1 text-[10px] ${
                      task.complete
                        ? "text-[#C6CFD9]"
                        : "text-[#667181]"
                    }`}
                  >
                    {task.label}
                  </span>

                  <span
                    className={`text-[8px] ${
                      task.complete
                        ? "text-[#68E0C9]"
                        : "text-[#5E6978]"
                    }`}
                  >
                    {task.complete ? "Completo" : "In attesa"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[18px] border border-white/[0.075] bg-[#11151C] p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A97A8]">
            Aree intelligence
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {sector.analysisAreas.map((area) => (
              <span
                key={area.id}
                className="rounded-[8px] border border-white/[0.07] bg-[#0E131B] px-2.5 py-2 text-[8px] text-[#AAB4C2]"
              >
                {area.label}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[18px] border border-[#5B7CFF]/18 bg-[#5B7CFF]/[0.05] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9AAEFF]">
                Tempo stimato
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#F5F7FA]">
                {estimatedMinutes}m 14s
              </p>

              <p className="mt-1 text-[9px] text-[#8A97A8]">
                per completare il primo ciclo
              </p>
            </div>

            <div
              className="flex size-16 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#5B7CFF ${completion}%, rgba(255,255,255,.06) 0)`,
              }}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-[#11151C] text-[10px] font-semibold text-[#A9B8FF]">
                {completion}%
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  progress,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
  progress?: number;
}) {
  return (
    <article className="rounded-[16px] border border-white/[0.07] bg-[#11151C] p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-[11px] border border-[#5B7CFF]/18 bg-[#5B7CFF]/[0.08] text-[#9AAEFF]">
          <Icon size={15} />
        </span>

        {typeof progress === "number" && (
          <span className="text-[9px] font-semibold text-[#68E0C9]">
            {progress}%
          </span>
        )}
      </div>

      <p className="mt-4 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#5E6978]">
        {label}
      </p>

      <p className="mt-2 truncate text-base font-semibold text-[#F5F7FA]">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-[#8A97A8]">
        {detail}
      </p>
    </article>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  completed,
  children,
}: {
  label: string;
  icon: typeof Building2;
  required?: boolean;
  completed: boolean;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A97A8]">
          <Icon size={13} />
          {label}

          {required && (
            <span className="text-[#F05D6C]">*</span>
          )}
        </span>

        {completed && (
          <CheckCircle2
            size={13}
            className="text-[#2DD4BF]"
          />
        )}
      </span>

      <span className="mt-3 block">
        {children}
      </span>
    </label>
  );
}
