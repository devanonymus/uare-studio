import type {
  IntegrationDefinition,
  IntegrationProvider,
} from "@/core/integrations/types";

export const INTEGRATION_REGISTRY: Record<
  IntegrationProvider,
  IntegrationDefinition
> = {
  meta: {
    provider: "meta",
    name: "Meta Business",
    description:
      "Facebook, Instagram, contenuti, insight e campagne pubblicitarie.",
    category: "Social e advertising",

    capabilities: [
      "read_insights",
      "read_content",
      "create_draft",
      "schedule_content",
      "publish_content",
      "read_campaigns",
      "manage_campaigns",
    ],

    requiredEnvironmentVariables: [
      "META_APP_ID",
      "META_APP_SECRET",
      "META_ACCESS_TOKEN",
    ],

    externalActions: [
      "schedule_content",
      "publish_content",
      "manage_campaigns",
    ],
  },

  google: {
    provider: "google",
    name: "Google Marketing",
    description:
      "Analytics, Search Console, Business Profile e campagne Google.",
    category: "Search e analytics",

    capabilities: [
      "read_insights",
      "read_analytics",
      "read_seo",
      "read_reviews",
      "reply_reviews",
      "read_campaigns",
      "manage_campaigns",
    ],

    requiredEnvironmentVariables: [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ],

    externalActions: [
      "reply_reviews",
      "manage_campaigns",
    ],
  },

  whatsapp: {
    provider: "whatsapp",
    name: "WhatsApp Business",
    description:
      "Messaggi, notifiche, follow-up e automazioni commerciali.",
    category: "Messaging",

    capabilities: [
      "create_draft",
      "send_messages",
    ],

    requiredEnvironmentVariables: [
      "WHATSAPP_ACCESS_TOKEN",
      "WHATSAPP_PHONE_NUMBER_ID",
      "WHATSAPP_BUSINESS_ACCOUNT_ID",
    ],

    externalActions: [
      "send_messages",
    ],
  },

  email: {
    provider: "email",
    name: "Email Provider",
    description:
      "Email transazionali, report, sequenze e follow-up.",
    category: "Email",

    capabilities: [
      "create_draft",
      "send_emails",
    ],

    requiredEnvironmentVariables: [
      "EMAIL_PROVIDER",
      "EMAIL_API_KEY",
      "EMAIL_FROM_ADDRESS",
    ],

    externalActions: [
      "send_emails",
    ],
  },

  wordpress: {
    provider: "wordpress",
    name: "WordPress",
    description:
      "Bozze, articoli SEO, pagine e aggiornamenti del sito.",
    category: "CMS e SEO",

    capabilities: [
      "read_content",
      "create_draft",
      "publish_seo",
    ],

    requiredEnvironmentVariables: [
      "WORDPRESS_BASE_URL",
      "WORDPRESS_USERNAME",
      "WORDPRESS_APP_PASSWORD",
    ],

    externalActions: [
      "publish_seo",
    ],
  },
};

export function getIntegrationDefinition(
  provider: string,
): IntegrationDefinition | null {
  if (
    provider in
    INTEGRATION_REGISTRY
  ) {
    return INTEGRATION_REGISTRY[
      provider as IntegrationProvider
    ];
  }

  return null;
}
