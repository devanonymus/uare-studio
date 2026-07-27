export type ApprovalAction =
  | "create_draft"
  | "analyse_data"
  | "generate_content"
  | "schedule_content"
  | "publish_content"
  | "send_email"
  | "send_whatsapp"
  | "reply_to_review"
  | "create_campaign"
  | "change_campaign_budget"
  | "pause_campaign"
  | "change_price"
  | "process_personal_data"
  | "modify_website"
  | "publish_seo_content";

export type ApprovalDecision = {
  required: boolean;

  requiredRole:
    | "none"
    | "manager"
    | "owner";

  riskLevel:
    | "low"
    | "medium"
    | "high"
    | "critical";

  reason: string;
};

const OWNER_ACTIONS =
  new Set<ApprovalAction>([
    "publish_content",
    "send_whatsapp",
    "reply_to_review",
    "create_campaign",
    "change_campaign_budget",
    "change_price",
    "process_personal_data",
    "modify_website",
    "publish_seo_content",
  ]);

const MANAGER_ACTIONS =
  new Set<ApprovalAction>([
    "schedule_content",
    "send_email",
    "pause_campaign",
  ]);

export function evaluateApprovalPolicy(
  action: ApprovalAction,
): ApprovalDecision {
  if (OWNER_ACTIONS.has(action)) {
    return {
      required: true,
      requiredRole: "owner",
      riskLevel:
        action === "change_price" ||
        action === "process_personal_data"
          ? "critical"
          : "high",

      reason:
        "L’azione produce un effetto esterno, " +
        "economico, reputazionale o relativo " +
        "a dati personali.",
    };
  }

  if (MANAGER_ACTIONS.has(action)) {
    return {
      required: true,
      requiredRole: "manager",
      riskLevel: "medium",

      reason:
        "L’azione modifica una pianificazione " +
        "o avvia una comunicazione esterna.",
    };
  }

  return {
    required: false,
    requiredRole: "none",
    riskLevel: "low",

    reason:
      "L’azione rimane interna al workspace " +
      "e non produce effetti esterni.",
  };
}
