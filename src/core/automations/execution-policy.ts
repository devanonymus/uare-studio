export type ExecutionPolicyResult = {
  allowed: boolean;
  mode: "sandbox";
  reason: string;
  externalExecutionAllowed: false;
};

export function evaluateAutomationExecutionPolicy({
  blueprintStatus,
  approvalRequired,
  dryRun,
}: {
  blueprintStatus: string;
  approvalRequired: boolean;
  dryRun: boolean;
}): ExecutionPolicyResult {
  if (
    approvalRequired &&
    blueprintStatus !== "approved"
  ) {
    return {
      allowed: false,
      mode: "sandbox",
      reason:
        "L’automazione richiede approvazione e non risulta approvata.",
      externalExecutionAllowed: false,
    };
  }

  if (
    ![
      "approved",
      "ready",
    ].includes(blueprintStatus)
  ) {
    return {
      allowed: false,
      mode: "sandbox",
      reason:
        `L’automazione è nello stato "${blueprintStatus}" e non può essere eseguita.`,
      externalExecutionAllowed: false,
    };
  }

  if (!dryRun) {
    return {
      allowed: false,
      mode: "sandbox",
      reason:
        "La modalità con effetti esterni non è ancora abilitata. È consentita soltanto la sandbox.",
      externalExecutionAllowed: false,
    };
  }

  return {
    allowed: true,
    mode: "sandbox",
    reason:
      "Automazione autorizzata per la generazione interna di bozze e piani.",
    externalExecutionAllowed: false,
  };
}
