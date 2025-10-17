import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-FE-002
// User Story: As a user, I want to interact with a 3x3 board to play.
// Acceptance Criteria: 3x3 grid, click empty, disabled when game over.
// GxP Impact: NO - UI layer, no data mutation beyond emitting index.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001 (service level)
// ============================================================================
*/

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  @Input() cells: string[] = Array(9).fill('');
  @Input() disabled = false;

  @Output() cellClick = new EventEmitter<number>();

  // PUBLIC_INTERFACE
  onCell(i: number) {
    /** Emit click if enabled */
    if (this.disabled) return;
    this.cellClick.emit(i);
  }

  // PUBLIC_INTERFACE
  trackByIndex(i: number): number {
    /** TrackBy function for performance */
    return i;
  }
}
