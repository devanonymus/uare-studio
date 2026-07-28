export type IntegrationProvider =
  | "meta"
  | "google"
  | "whatsapp"
  | "email"
  | "wordpress";

export type IntegrationCapability =
  | "read_insights"
  | "read_content"
  | "create_draft"
  | "schedule_content"
  | "publish_content"
  | "read_campaigns"
  | "manage_campaigns"
  | "read_seo"
  | "publish_seo"
  | "read_reviews"
  | "reply_reviews"
  | "send_messages"
  | "send_emails"
  | "read_analytics";

export type IntegrationDefinition = {
  provider: IntegrationProvider;
  name: string;
  description: string;
  category: string;

  capabilities: IntegrationCapability[];

  requiredEnvironmentVariables: string[];

  externalActions: IntegrationCapability[];
};
