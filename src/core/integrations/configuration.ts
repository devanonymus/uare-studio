import type {
  IntegrationDefinition,
  IntegrationProvider,
} from "@/core/integrations/types";
import {
  INTEGRATION_REGISTRY,
} from "@/core/integrations/registry";

export type IntegrationConfigurationStatus = {
  provider: IntegrationProvider;
  configured: boolean;
  presentVariables: string[];
  missingVariables: string[];
  readiness: number;
};

export function inspectIntegrationConfiguration(
  definition: IntegrationDefinition,
): IntegrationConfigurationStatus {
  const presentVariables =
    definition.requiredEnvironmentVariables.filter(
      (variable) =>
        Boolean(
          process.env[variable]?.trim(),
        ),
    );

  const missingVariables =
    definition.requiredEnvironmentVariables.filter(
      (variable) =>
        !process.env[variable]?.trim(),
    );

  const total =
    definition.requiredEnvironmentVariables.length;

  const readiness =
    total === 0
      ? 100
      : Math.round(
          (presentVariables.length /
            total) *
            100,
        );

  return {
    provider: definition.provider,
    configured:
      missingVariables.length === 0,
    presentVariables,
    missingVariables,
    readiness,
  };
}

export function inspectAllIntegrations() {
  return Object.values(
    INTEGRATION_REGISTRY,
  ).map((definition) => ({
    definition,
    configuration:
      inspectIntegrationConfiguration(
        definition,
      ),
  }));
}
