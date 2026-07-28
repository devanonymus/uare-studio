export type KnowledgeNodeType =
  | "business"
  | "memory"
  | "evidence"
  | "mission"
  | "automation"
  | "artifact"
  | "integration"
  | "goal"
  | "audience"
  | "offer"
  | "channel"
  | "competitor"
  | "kpi"
  | "unknown";

export type KnowledgeRelationType =
  | "has_memory"
  | "supported_by"
  | "generates"
  | "requires"
  | "produces"
  | "belongs_to"
  | "uses_channel"
  | "targets"
  | "measures"
  | "depends_on"
  | "connected_to"
  | "blocks"
  | "approves"
  | "contradicts"
  | "relates_to";

export type KnowledgeNodeInput = {
  organisationId: string;
  businessId: string;
  nodeType: KnowledgeNodeType;
  externalKey: string;
  label: string;
  description?: string | null;
  status?: string;
  confidence?: number | null;
  sourceTable?: string | null;
  sourceRecordId?: string | null;
  attributes?: Record<string, unknown>;
};

export type KnowledgeEdgeInput = {
  organisationId: string;
  businessId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: KnowledgeRelationType;
  confidence?: number;
  evidence?: unknown[];
  attributes?: Record<string, unknown>;
};
