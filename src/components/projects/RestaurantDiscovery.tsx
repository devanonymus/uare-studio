"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Globe2,
  Camera,
  MapPin,
  MessageCircle,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Utensils,
  Users,
  Workflow,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type DiscoveryData = {
  businessName: string;
  city: string;
  address: string;
  website: string;
  instagram: string;
  googleProfile: string;
  phone: string;
  cuisine: string;
  serviceModel: string;
  averageTicket: string;
  seats: string;
  openingDays: string;
  primaryGoal: string;
  secondaryGoals: string[];
  currentChannels: string[];
  bookingMethod: string;
  takeaway: string;
  delivery: string;
  crmStatus: string;
  monthlyMarketingBudget: string;
  mainProblem: string;
  notes: string;
  consent: boolean;
};

const initialData: DiscoveryData = {
  businessName: "",
  city: "",
  address: "",
  website: "",
  instagram: "",
  googleProfile: "",
  phone: "",
  cuisine: "",
  serviceModel: "",
  averageTicket: "",
  seats: "",
  openingDays: "",
  primaryGoal: "",
  secondaryGoals: [],
  currentChannels: [],
  bookingMethod: "",
  takeaway: "",
  delivery: "",
  crmStatus: "",
  monthlyMarketingBudget: "",
  mainProblem: "",
  notes: "",
  consent: false,
};

const steps = [
  {
    id: 1,
    title: "Identità",
    description: "Dati essenziali dell’attività",
  },
  {
    id: 2,
    title: "Modello operativo",
    description: "Servizi, clienti e processi",
  },
  {
    id: 3,
    title: "Obiettivi",
    description: "Priorità commerciali",
  },
  {
    id: 4,
    title: "Canali e automazioni",
    description: "Stato digitale attuale",
  },
  {
    id: 5,
    title: "Conferma",
    description: "Riepilogo e avvio",
  },
];

const secondaryGoalOptions = [
  "Aumentare prenotazioni",
  "Aumentare asporto",
  "Migliorare reputazione",
  "Produrre contenuti",
  "Aumentare clienti ricorrenti",
  "Ridurre attività manuali",
  "Lanciare campagne pubblicitarie",
];

const channelOptions = [
  "Sito web",
  "Google Business Profile",
  "Instagram",
  "Facebook",
  "TikTok",
  "WhatsApp Business",
  "Email marketing",
  "Piattaforme delivery",
];

export function RestaurantDiscovery() {
  const [step, setStep] = useState(1);
  const [data, setData] =
    useState<DiscoveryData>(initialData);
  const [savedAt, setSavedAt] =
    useState<string | null>(null);
  const [submitted, setSubmitted] =
    useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(
      "uviq:restaurant-discovery",
    );

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setData({
        ...initialData,
        ...parsed,
      });
    } catch {
      window.localStorage.removeItem(
        "uviq:restaurant-discovery",
      );
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(
        "uviq:restaurant-discovery",
        JSON.stringify(data),
      );

      setSavedAt(
        new Intl.DateTimeFormat("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [data]);

  const requiredFields = [
    data.businessName,
    data.city,
    data.cuisine,
    data.serviceModel,
    data.primaryGoal,
    data.mainProblem,
  ];

  const completion = Math.round(
    (requiredFields.filter(Boolean).length /
      requiredFields.length) *
      100,
  );

  const currentStepValid = useMemo(() => {
    if (step === 1) {
      return Boolean(
        data.businessName.trim() &&
          data.city.trim(),
      );
    }

    if (step === 2) {
      return Boolean(
        data.cuisine &&
          data.serviceModel,
      );
    }

    if (step === 3) {
      return Boolean(
        data.primaryGoal &&
          data.mainProblem.trim(),
      );
    }

    if (step === 4) {
      return true;
    }

    return data.consent;
  }, [data, step]);

  function updateField(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function toggleArrayValue(
    field:
      | "secondaryGoals"
      | "currentChannels",
    value: string,
  ) {
    setData((current) => {
      const values = current[field];

      return {
        ...current,
        [field]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  }

  function goNext() {
    if (!currentStepValid) {
      return;
    }

    setStep((current) =>
      Math.min(5, current + 1),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goBack() {
    setStep((current) =>
      Math.max(1, current - 1),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!data.consent) {
      return;
    }

    window.localStorage.setItem(
      "uviq:restaurant-discovery",
      JSON.stringify(data),
    );

    window.localStorage.setItem(
      "uviq:active-project",
      JSON.stringify({
        sector: "restaurant",
        businessName: data.businessName,
        city: data.city,
        createdAt: new Date().toISOString(),
        status: "discovery-completed",
      }),
    );

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="rounded-[24px] border border-[#24D27C]/20 bg-[#0B1628] p-7 md:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-[18px] border border-[#24D27C]/25 bg-[#24D27C]/10 text-[#8AF0BA]">
            <CheckCircle2 size={27} />
          </span>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-[#8AF0BA]">
            Discovery completata
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
            Il progetto è pronto per la fase Intelligence.
          </h2>

          <p className="mt-5 text-base leading-8 text-[#CBD6E2]">
            I dati di{" "}
            <strong className="font-semibold text-white">
              {data.businessName}
            </strong>{" "}
            sono stati salvati. Nessuna ricerca, pubblicazione
            o automazione è stata ancora avviata.
          </p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            <ConfirmationCard
              title="Discovery"
              value="Completata"
              color="#24D27C"
            />

            <ConfirmationCard
              title="Research"
              value="Da avviare"
              color="#2492E8"
            />

            <ConfirmationCard
              title="Business Twin"
              value="Non generato"
              color="#6D4FD2"
            />
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/audits/new?sector=restaurant"
              className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-[13px] bg-[#FF6B1A] px-7 text-sm font-semibold text-white transition hover:bg-[#FF7D34]"
            >
              Configura l’Intelligence
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex min-h-13 items-center justify-center rounded-[13px] border border-white/[0.11] bg-white/[0.04] px-7 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
            >
              Torna alla Mission Control
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 xl:grid-cols-[1fr_390px]"
    >
      <section className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0B1628]">
        <header className="border-b border-white/[0.08] px-6 py-6 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                Business Discovery
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
                {steps[step - 1].title}
              </h2>

              <p className="mt-2 text-sm text-[#B8C5D4]">
                {steps[step - 1].description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-xs text-[#AEBCCC]">
                <Save size={13} className="text-[#24D27C]" />
                {savedAt
                  ? `Salvato alle ${savedAt}`
                  : "Salvataggio automatico"}
              </span>

              <span className="rounded-full border border-[#2492E8]/20 bg-[#2492E8]/10 px-3 py-1.5 text-xs font-semibold text-[#79C6F5]">
                {step}/5
              </span>
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-[#2492E8] transition-all duration-300"
              style={{
                width: `${(step / 5) * 100}%`,
              }}
            />
          </div>
        </header>

        <div className="p-6 md:p-8">
          {step === 1 && (
            <IdentityStep
              data={data}
              updateField={updateField}
            />
          )}

          {step === 2 && (
            <OperatingModelStep
              data={data}
              updateField={updateField}
            />
          )}

          {step === 3 && (
            <GoalsStep
              data={data}
              updateField={updateField}
              toggleArrayValue={toggleArrayValue}
            />
          )}

          {step === 4 && (
            <ChannelsStep
              data={data}
              updateField={updateField}
              toggleArrayValue={toggleArrayValue}
            />
          )}

          {step === 5 && (
            <ConfirmationStep
              data={data}
              setData={setData}
            />
          )}
        </div>

        <footer className="flex flex-col-reverse justify-between gap-3 border-t border-white/[0.08] bg-[#091321] px-6 py-5 sm:flex-row sm:items-center md:px-8">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[12px] border border-white/[0.1] bg-white/[0.035] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.065] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft size={15} />
            Indietro
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!currentStepValid}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[12px] bg-[#FF6B1A] px-6 text-sm font-semibold text-white transition hover:bg-[#FF7D34] disabled:cursor-not-allowed disabled:bg-[#56301F] disabled:text-[#AEBCCC]"
            >
              Continua
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!data.consent}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[12px] bg-[#FF6B1A] px-6 text-sm font-semibold text-white transition hover:bg-[#FF7D34] disabled:cursor-not-allowed disabled:bg-[#56301F] disabled:text-[#AEBCCC]"
            >
              Conferma la Discovery
              <CheckCircle2 size={16} />
            </button>
          )}
        </footer>
      </section>

      <DiscoverySummary
        step={step}
        data={data}
        completion={completion}
        setStep={setStep}
      />
    </form>
  );
}

function IdentityStep({
  data,
  updateField,
}: {
  data: DiscoveryData;
  updateField: (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => void;
}) {
  return (
    <div>
      <StepIntro
        icon={Building2}
        title="Identifichiamo correttamente l’attività."
        description="Questi dati permettono a UVIQ di riconoscere l’azienda e preparare le fonti da analizzare."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field
          label="Nome attività"
          required
        >
          <input
            name="businessName"
            value={data.businessName}
            onChange={updateField}
            placeholder="Es. Yammy Ristorante Giapponese"
            className={inputClass}
          />
        </Field>

        <Field label="Città" required>
          <div className="relative">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA2B9]"
            />

            <input
              name="city"
              value={data.city}
              onChange={updateField}
              placeholder="Es. Martina Franca"
              className={`${inputClass} pl-11`}
            />
          </div>
        </Field>

        <Field label="Indirizzo">
          <input
            name="address"
            value={data.address}
            onChange={updateField}
            placeholder="Via, numero civico"
            className={inputClass}
          />
        </Field>

        <Field label="Telefono">
          <input
            name="phone"
            value={data.phone}
            onChange={updateField}
            placeholder="+39 ..."
            className={inputClass}
          />
        </Field>

        <Field label="Sito web">
          <div className="relative">
            <Globe2
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA2B9]"
            />

            <input
              name="website"
              value={data.website}
              onChange={updateField}
              placeholder="https://..."
              className={`${inputClass} pl-11`}
            />
          </div>
        </Field>

        <Field label="Instagram">
          <div className="relative">
            <Camera
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA2B9]"
            />

            <input
              name="instagram"
              value={data.instagram}
              onChange={updateField}
              placeholder="@nomeprofilo"
              className={`${inputClass} pl-11`}
            />
          </div>
        </Field>

        <Field
          label="Google Business Profile"
          className="md:col-span-2"
        >
          <input
            name="googleProfile"
            value={data.googleProfile}
            onChange={updateField}
            placeholder="Link alla scheda Google, se disponibile"
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}

function OperatingModelStep({
  data,
  updateField,
}: {
  data: DiscoveryData;
  updateField: (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => void;
}) {
  return (
    <div>
      <StepIntro
        icon={Utensils}
        title="Comprendiamo come funziona il ristorante."
        description="Il modello operativo determina quali metriche, opportunità e automazioni hanno realmente senso."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field
          label="Tipologia di cucina"
          required
        >
          <select
            name="cuisine"
            value={data.cuisine}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">Seleziona</option>
            <option value="giapponese">
              Giapponese / Sushi
            </option>
            <option value="cinese">
              Cinese
            </option>
            <option value="italiana">
              Italiana
            </option>
            <option value="pizzeria">
              Pizzeria
            </option>
            <option value="fusion">
              Fusion
            </option>
            <option value="altro">
              Altro
            </option>
          </select>
        </Field>

        <Field
          label="Modello di servizio"
          required
        >
          <select
            name="serviceModel"
            value={data.serviceModel}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">Seleziona</option>
            <option value="alla-carta">
              À la carte
            </option>
            <option value="ayce">
              All you can eat
            </option>
            <option value="fast-casual">
              Fast casual
            </option>
            <option value="takeaway">
              Prevalentemente asporto
            </option>
            <option value="ibrido">
              Modello ibrido
            </option>
          </select>
        </Field>

        <Field label="Scontrino medio">
          <select
            name="averageTicket"
            value={data.averageTicket}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">
              Non specificato
            </option>
            <option value="under-20">
              Meno di 20 €
            </option>
            <option value="20-35">
              Tra 20 € e 35 €
            </option>
            <option value="35-60">
              Tra 35 € e 60 €
            </option>
            <option value="over-60">
              Oltre 60 €
            </option>
          </select>
        </Field>

        <Field label="Posti disponibili">
          <input
            name="seats"
            type="number"
            min="0"
            value={data.seats}
            onChange={updateField}
            placeholder="Es. 80"
            className={inputClass}
          />
        </Field>

        <Field label="Giorni di apertura">
          <input
            name="openingDays"
            value={data.openingDays}
            onChange={updateField}
            placeholder="Es. 7 giorni su 7"
            className={inputClass}
          />
        </Field>

        <Field label="Prenotazioni">
          <select
            name="bookingMethod"
            value={data.bookingMethod}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">
              Non specificato
            </option>
            <option value="phone">
              Telefono
            </option>
            <option value="whatsapp">
              WhatsApp
            </option>
            <option value="website">
              Sito web
            </option>
            <option value="platform">
              Piattaforma esterna
            </option>
            <option value="multiple">
              Più canali
            </option>
          </select>
        </Field>

        <Field label="Servizio asporto">
          <select
            name="takeaway"
            value={data.takeaway}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">
              Non specificato
            </option>
            <option value="yes">Attivo</option>
            <option value="no">
              Non attivo
            </option>
            <option value="improve">
              Attivo ma da migliorare
            </option>
          </select>
        </Field>

        <Field label="Servizio delivery">
          <select
            name="delivery"
            value={data.delivery}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">
              Non specificato
            </option>
            <option value="internal">
              Consegna interna
            </option>
            <option value="platforms">
              Piattaforme esterne
            </option>
            <option value="both">
              Entrambi
            </option>
            <option value="none">
              Non attivo
            </option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function GoalsStep({
  data,
  updateField,
  toggleArrayValue,
}: {
  data: DiscoveryData;
  updateField: (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => void;
  toggleArrayValue: (
    field:
      | "secondaryGoals"
      | "currentChannels",
    value: string,
  ) => void;
}) {
  return (
    <div>
      <StepIntro
        icon={Target}
        title="Definiamo una priorità commerciale concreta."
        description="Gli agenti non devono ottimizzare tutto contemporaneamente: serve un obiettivo principale misurabile."
      />

      <div className="mt-8 space-y-6">
        <Field
          label="Obiettivo principale"
          required
        >
          <select
            name="primaryGoal"
            value={data.primaryGoal}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">Seleziona</option>
            <option value="bookings">
              Aumentare prenotazioni
            </option>
            <option value="takeaway">
              Aumentare asporto e delivery
            </option>
            <option value="reputation">
              Migliorare reputazione
            </option>
            <option value="retention">
              Aumentare clienti ricorrenti
            </option>
            <option value="content">
              Migliorare comunicazione e contenuti
            </option>
            <option value="automation">
              Automatizzare processi
            </option>
          </select>
        </Field>

        <Field label="Obiettivi secondari">
          <ChoiceGrid
            values={secondaryGoalOptions}
            selected={data.secondaryGoals}
            onToggle={(value) =>
              toggleArrayValue(
                "secondaryGoals",
                value,
              )
            }
          />
        </Field>

        <Field
          label="Problema principale da risolvere"
          required
        >
          <textarea
            name="mainProblem"
            value={data.mainProblem}
            onChange={updateField}
            placeholder="Descrivi il problema più importante: poche prenotazioni, comunicazione discontinua, gestione manuale dei contatti..."
            className={`${inputClass} min-h-[150px] resize-y py-4`}
          />
        </Field>

        <Field label="Budget marketing mensile">
          <select
            name="monthlyMarketingBudget"
            value={data.monthlyMarketingBudget}
            onChange={updateField}
            className={inputClass}
          >
            <option value="">
              Non definito
            </option>
            <option value="under-500">
              Meno di 500 €
            </option>
            <option value="500-1000">
              500 € – 1.000 €
            </option>
            <option value="1000-2500">
              1.000 € – 2.500 €
            </option>
            <option value="over-2500">
              Oltre 2.500 €
            </option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function ChannelsStep({
  data,
  updateField,
  toggleArrayValue,
}: {
  data: DiscoveryData;
  updateField: (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => void;
  toggleArrayValue: (
    field:
      | "secondaryGoals"
      | "currentChannels",
    value: string,
  ) => void;
}) {
  return (
    <div>
      <StepIntro
        icon={Workflow}
        title="Mappiamo ciò che esiste già."
        description="UVIQ deve integrarsi con strumenti e processi reali, evitando di proporre attività duplicate o inutili."
      />

      <div className="mt-8 space-y-6">
        <Field label="Canali attualmente utilizzati">
          <ChoiceGrid
            values={channelOptions}
            selected={data.currentChannels}
            onToggle={(value) =>
              toggleArrayValue(
                "currentChannels",
                value,
              )
            }
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Gestione clienti / CRM">
            <select
              name="crmStatus"
              value={data.crmStatus}
              onChange={updateField}
              className={inputClass}
            >
              <option value="">
                Non specificato
              </option>
              <option value="none">
                Nessun sistema
              </option>
              <option value="excel">
                Excel o fogli manuali
              </option>
              <option value="software">
                Software dedicato
              </option>
              <option value="informal">
                Gestione informale
              </option>
            </select>
          </Field>

          <Field label="WhatsApp Business">
            <select
              name="bookingMethod"
              value={data.bookingMethod}
              onChange={updateField}
              className={inputClass}
            >
              <option value="">
                Non specificato
              </option>
              <option value="whatsapp">
                Usato per prenotazioni
              </option>
              <option value="multiple">
                Usato anche per assistenza
              </option>
              <option value="phone">
                Non utilizzato
              </option>
            </select>
          </Field>
        </div>

        <Field label="Informazioni aggiuntive">
          <textarea
            name="notes"
            value={data.notes}
            onChange={updateField}
            placeholder="Team interno, stagionalità, promozioni, problemi tecnici, strumenti già utilizzati..."
            className={`${inputClass} min-h-[150px] resize-y py-4`}
          />
        </Field>
      </div>
    </div>
  );
}

function ConfirmationStep({
  data,
  setData,
}: {
  data: DiscoveryData;
  setData: React.Dispatch<
    React.SetStateAction<DiscoveryData>
  >;
}) {
  const primaryGoalLabel =
    {
      bookings: "Aumentare prenotazioni",
      takeaway: "Aumentare asporto e delivery",
      reputation: "Migliorare reputazione",
      retention: "Aumentare clienti ricorrenti",
      content: "Migliorare comunicazione e contenuti",
      automation: "Automatizzare processi",
    }[data.primaryGoal] || "Non specificato";

  return (
    <div>
      <StepIntro
        icon={ShieldCheck}
        title="Controlla i dati prima di procedere."
        description="La fase successiva utilizzerà queste informazioni per configurare fonti, agenti e criteri di analisi."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ReviewCard
          title="Attività"
          rows={[
            [
              "Nome",
              data.businessName || "Non specificato",
            ],
            [
              "Città",
              data.city || "Non specificata",
            ],
            [
              "Sito",
              data.website || "Non specificato",
            ],
          ]}
        />

        <ReviewCard
          title="Modello"
          rows={[
            [
              "Cucina",
              data.cuisine || "Non specificata",
            ],
            [
              "Servizio",
              data.serviceModel ||
                "Non specificato",
            ],
            [
              "Prenotazioni",
              data.bookingMethod ||
                "Non specificato",
            ],
          ]}
        />

        <ReviewCard
          title="Obiettivo"
          rows={[
            [
              "Priorità",
              primaryGoalLabel,
            ],
            [
              "Budget",
              data.monthlyMarketingBudget ||
                "Non definito",
            ],
          ]}
        />

        <ReviewCard
          title="Canali"
          rows={[
            [
              "Canali attivi",
              data.currentChannels.length
                ? data.currentChannels.join(", ")
                : "Non specificati",
            ],
            [
              "CRM",
              data.crmStatus ||
                "Non specificato",
            ],
          ]}
        />
      </div>

      <label className="mt-7 flex cursor-pointer items-start gap-4 rounded-[16px] border border-white/[0.09] bg-[#07111F]/55 p-5">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(event) =>
            setData((current) => ({
              ...current,
              consent: event.target.checked,
            }))
          }
          className="mt-1 size-4 accent-[#FF6B1A]"
        />

        <span>
          <span className="block text-sm font-semibold text-white">
            Confermo la correttezza delle informazioni
          </span>

          <span className="mt-2 block text-sm leading-6 text-[#B8C5D4]">
            Comprendo che la conferma salva la Discovery,
            ma non avvia automaticamente pubblicazioni,
            campagne, messaggi o automazioni.
          </span>
        </span>
      </label>
    </div>
  );
}

function DiscoverySummary({
  step,
  data,
  completion,
  setStep,
}: {
  step: number;
  data: DiscoveryData;
  completion: number;
  setStep: (value: number) => void;
}) {
  return (
    <aside className="xl:sticky xl:top-[108px] xl:self-start">
      <article className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#0B1628]">
        <header className="border-b border-white/[0.08] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#79C6F5]">
                Riepilogo progetto
              </p>

              <h2 className="mt-3 text-xl font-semibold text-white">
                {data.businessName ||
                  "Nuovo ristorante"}
              </h2>

              <p className="mt-2 text-sm text-[#B8C5D4]">
                {data.city ||
                  "Località non specificata"}
              </p>
            </div>

            <span className="flex size-11 items-center justify-center rounded-[13px] border border-[#FF6B1A]/20 bg-[#FF6B1A]/10 text-[#FF9A64]">
              <Utensils size={18} />
            </span>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#B8C5D4]">
                Dati essenziali
              </span>

              <span className="font-semibold text-white">
                {completion}%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[#24D27C] transition-all"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>
        </header>

        <div className="p-4">
          {steps.map((item) => {
            const completed = item.id < step;
            const active = item.id === step;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id <= step) {
                    setStep(item.id);
                  }
                }}
                className={`flex w-full items-center gap-4 rounded-[13px] px-4 py-4 text-left transition ${
                  active
                    ? "bg-[#2492E8]/10"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-[10px] border text-xs font-semibold ${
                    completed
                      ? "border-[#24D27C] bg-[#24D27C] text-[#07111F]"
                      : active
                        ? "border-[#2492E8] bg-[#2492E8] text-white"
                        : "border-white/[0.1] text-[#9EADC0]"
                  }`}
                >
                  {completed ? (
                    <Check size={14} />
                  ) : (
                    item.id
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">
                    {item.title}
                  </span>

                  <span className="mt-1 block text-xs text-[#AEBCCC]">
                    {item.description}
                  </span>
                </span>

                <ChevronRight
                  size={14}
                  className="text-[#71839B]"
                />
              </button>
            );
          })}
        </div>
      </article>

      <article className="mt-4 rounded-[18px] border border-white/[0.08] bg-[#0B1628] p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-[#24D27C]/20 bg-[#24D27C]/10 text-[#8AF0BA]">
            <ShieldCheck size={17} />
          </span>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Controllo e privacy
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#B8C5D4]">
              I dati restano in bozza sul dispositivo fino
              alla conferma. Nessuna azione esterna viene
              eseguita in questa fase.
            </p>
          </div>
        </div>
      </article>
    </aside>
  );
}

function StepIntro({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[16px] border border-[#2492E8]/16 bg-[#2492E8]/[0.055] p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border border-[#2492E8]/20 bg-[#2492E8]/10 text-[#79C6F5]">
        <Icon size={18} />
      </span>

      <div>
        <h3 className="text-base font-semibold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#C8D4E1]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#D6DFE9]">
        {label}

        {required && (
          <span className="text-[#FF8A4A]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function ChoiceGrid({
  values,
  selected,
  onToggle,
}: {
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {values.map((value) => {
        const active = selected.includes(value);

        return (
          <button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            className={`flex min-h-12 items-center justify-between gap-3 rounded-[12px] border px-4 text-left text-sm font-medium transition ${
              active
                ? "border-[#2492E8]/45 bg-[#2492E8]/10 text-white"
                : "border-white/[0.08] bg-[#07111F]/45 text-[#C8D4E1] hover:border-white/[0.16]"
            }`}
          >
            {value}

            <span
              className={`flex size-5 items-center justify-center rounded-full border ${
                active
                  ? "border-[#2492E8] bg-[#2492E8] text-white"
                  : "border-white/[0.12] text-transparent"
              }`}
            >
              <Check size={11} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ReviewCard({
  title,
  rows,
}: {
  title: string;
  rows: string[][];
}) {
  return (
    <article className="rounded-[16px] border border-white/[0.08] bg-[#07111F]/50 p-5">
      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
          >
            <p className="text-xs text-[#AEBCCC]">
              {label}
            </p>

            <p className="mt-1 text-sm font-medium text-[#D6DFE9]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ConfirmationCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-[14px] border border-white/[0.08] bg-[#07111F]/50 p-4">
      <p className="text-xs text-[#AEBCCC]">
        {title}
      </p>

      <p
        className="mt-2 text-sm font-semibold"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

const inputClass =
  "min-h-12 w-full rounded-[12px] border border-white/[0.1] bg-[#07111F]/65 px-4 text-sm text-white outline-none transition placeholder:text-[#8496AC] focus:border-[#2492E8]/55 focus:ring-4 focus:ring-[#2492E8]/10";
