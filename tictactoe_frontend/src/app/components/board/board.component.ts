import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';

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
  imports: [NgFor],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  // Define Cell union matching game service: '', 'X', 'O'
  private static readonly EMPTY: '' = '';
  @Input() cells: ('' | 'X' | 'O')[] = Array(9).fill(BoardComponent.EMPTY);
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

  // PUBLIC_INTERFACE
  iconFor(value: string): string {
    /** Map stored mark to display icon (Unicode chess). X→♞ (Knight), O→♛ (Queen), ''→'' */
    switch (value) {
      case 'X': return '♞';
      case 'O': return '♛';
      default: return '';
    }
  }

  // PUBLIC_INTERFACE
  ariaLabelFor(value: string, index: number): string {
    /**
     * Builds accessible label for a cell.
     * Empty cells are announced as "Cell {index} empty".
     * X cells are "Cell {index} Knight", O cells are "Cell {index} Queen".
     */
    const role = value === 'X' ? 'Knight' : value === 'O' ? 'Queen' : 'empty';
    return `Cell ${index} ${role}`;
  }
}
