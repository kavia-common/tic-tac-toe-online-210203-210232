/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-COM-001
// User Story: As a compliance auditor, I need in-memory audit trail with metadata.
// Acceptance Criteria: timestamp ISO, userId, action, before/after, reason.
// GxP Impact: YES - Audit metadata model.
// Risk Level: LOW
// ============================================================================
*/

export enum ActionType {
  MOVE = 'MOVE',
  RESET = 'RESET',
  ERROR = 'ERROR',
}

export enum Role {
  Player = 'Player',
  Auditor = 'Auditor',
}

export interface AuditMetadata {
  index?: number;
  boardBefore?: string[];
  boardAfter?: string[];
  reason?: string;
  error?: string;
}

// PUBLIC_INTERFACE
export interface AuditEntry {
  /** ISO timestamp of the event */
  timestamp: string;
  /** Attributable user identifier */
  userId: string;
  /** Action performed */
  action: ActionType;
  /** Structured metadata for change context */
  metadata?: AuditMetadata;
}
