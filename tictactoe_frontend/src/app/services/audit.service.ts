/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-SVC-001
// User Story: As a system, I must log moves and resets with metadata.
// Acceptance Criteria: ISO timestamp, userId, action, before/after.
// GxP Impact: YES - Audit trail implementation.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001
// ============================================================================
*/

import { Injectable, signal } from '@angular/core';
import { ActionType, AuditEntry, AuditMetadata } from '../models/audit.models';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private entriesSig = signal<AuditEntry[]>([]);

  // PUBLIC_INTERFACE
  getEntries(): AuditEntry[] {
    /** Returns a snapshot of audit entries */
    return this.entriesSig();
  }

  // PUBLIC_INTERFACE
  log(userId: string, action: ActionType, metadata?: AuditMetadata): void {
    /**
     * Adds an audit entry.
     * Audit: captures user, action, metadata, ISO timestamp.
     */
    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      metadata,
    };
    this.entriesSig.update((prev) => [entry, ...prev]);
  }

  // PUBLIC_INTERFACE
  clear(): void {
    /** Clears the audit log (would be restricted to Auditor in future). */
    this.entriesSig.set([]);
  }
}
