/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-FE-001
// User Story: As a user, I want to play Tic Tac Toe in a modern UI, with scores and restart.
// Acceptance Criteria:
// - Centered 3x3 board, current player indicator, score display (X/O/Draw), and Restart button.
// - Clicking an empty cell marks it, switches turn.
// - Win/draw detection and lock after game over until restart.
// - Audit trail for each move with timestamp, player, cell index, and board snapshot.
// - Ocean Professional theme with rounded corners and subtle shadows.
// - Unit tests for game logic.
// - Stub for vs-computer mode.
// GxP Impact: YES - Audit trail, validation, error handling scaffolding included.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001
// ============================================================================
// IMPORTS AND DEPENDENCIES
// ============================================================================
*/
import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { GameService } from './services/game.service';
import { AuditService } from './services/audit.service';
import { Role } from './models/audit.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /** App title for header/SEO */
  title = 'Tic Tac Toe';

  // RBAC scaffolding placeholders
  currentRole = signal<Role>(Role.Player);

  // View signals derived from GameService
  private game = inject(GameService);
  private audit = inject(AuditService);

  board = this.game.board;
  currentPlayer = this.game.currentPlayer;
  isGameOver = this.game.isGameOver;
  winner = this.game.winner;
  scores = this.game.scores;

  // vs-computer mode scaffold (disabled for now)
  singlePlayerEnabled = false;
  singlePlayerRequested = signal<boolean>(false);

  constructor() {
    // Observe state changes; reserved for telemetry or additional compliance hooks
    effect(() => {
      void this.board(); // trigger reaction
    });
  }

  // PUBLIC_INTERFACE
  onCellClick(index: number): void {
    /** Handles board cell click, validates move via GameService. */
    // RBAC placeholder: check permissions before move
    // if (!this.hasPermission('PLAY_MOVE')) return;
    this.game.makeMove(index);
  }

  // PUBLIC_INTERFACE
  onRestart(): void {
    /** Resets the game state and records audit log. */
    this.game.reset('User requested restart');
  }

  // PUBLIC_INTERFACE
  toggleSinglePlayer(): void {
    /** Placeholder to toggle single-player mode (disabled UI for now). */
    this.singlePlayerRequested.set(!this.singlePlayerRequested());
    // Future: wire to GameService to enable AI opponent
  }

  // PUBLIC_INTERFACE
  getAuditTrail() {
    /** Exposes current audit trail entries for UI inspection/debug (Auditor role in future). */
    return this.audit.getEntries();
  }
}
