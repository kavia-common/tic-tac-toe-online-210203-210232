/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TTT-SVC-002
// User Story: As a player, I need game logic to make moves, detect wins/draws, reset game, and track scores.
// Acceptance Criteria:
// - Board string[9], 'X' | 'O' | ''.
// - validateMove(index): boolean.
// - makeMove(index): updates state and logs audit.
// - Win/draw detection, stop input on game over until reset.
// - Scores tracked for X/O/draws.
// - Reset logs reason.
// - Computer opponent stub available for future.
// GxP Impact: YES - Validation, audit, error handling scaffolding.
// Risk Level: LOW
// Validation Protocol: VP-TTT-UNIT-001
// ============================================================================
*/

import { Injectable, signal } from '@angular/core';
import { AuditService } from './audit.service';
import { ActionType } from '../models/audit.models';

type Player = 'X' | 'O';
type Cell = '' | Player;

export interface Scores {
  x: number;
  o: number;
  d: number;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  // Signals to hold state
  board = signal<Cell[]>(Array<Cell>(9).fill(''));
  currentPlayer = signal<Player>('X');
  isGameOver = signal<boolean>(false);
  winner = signal<Cell>('');
  scores = signal<Scores>({ x: 0, o: 0, d: 0 });

  constructor(private audit: AuditService) {}

  // PUBLIC_INTERFACE
  validateMove(index: number): boolean {
    /**
     * Validate a move index.
     * Parameters: index integer 0..8
     * Returns: true if allowed
     * Throws: none
     * Audit: None (only successful move logs)
     */
    if (this.isGameOver()) return false;
    if (!Number.isInteger(index) || index < 0 || index > 8) return false;
    const b = this.board();
    return b[index] === '';
  }

  // PUBLIC_INTERFACE
  makeMove(index: number): boolean {
    /**
     * Attempt to make a move for current player.
     * Input validation and business rules enforced.
     * Audit: Log MOVE with before/after boards and index.
     * Returns: true if move applied, false otherwise.
     */
    try {
      if (!this.validateMove(index)) {
        return false;
      }
      const before = [...this.board()];
      const player = this.currentPlayer();
      const after = [...before];
      after[index] = player;

      this.board.set(after);

      // Check for win/draw and update state
      const win = this.checkWinner(after);
      if (win) {
        this.isGameOver.set(true);
        this.winner.set(win);
        this.incrementScore(win);
      } else if (this.isDraw(after)) {
        this.isGameOver.set(true);
        this.winner.set('');
        this.incrementDraw();
      } else {
        this.togglePlayer();
      }

      // Audit log
      this.audit.log(`player${player}`, ActionType.MOVE, {
        index,
        boardBefore: before,
        boardAfter: after,
      });

      // Computer move stub for future
      // if (this.singlePlayerEnabled && this.currentPlayer() === 'O') { this.computerMoveStub(); }

      return true;
    } catch (err: unknown) {
      // Error handling scaffolding
      const error = err instanceof Error ? err.message : String(err);
      this.audit.log('system', ActionType.ERROR, { error });
      return false;
    }
  }

  // PUBLIC_INTERFACE
  reset(reason?: string): void {
    /**
     * Reset the game state to initial configuration.
     * Audit: RESET with reason and (optionally) before state.
     */
    const before = [...this.board()];
    this.board.set(Array<Cell>(9).fill(''));
    this.currentPlayer.set('X');
    this.isGameOver.set(false);
    this.winner.set('');
    this.audit.log('system', ActionType.RESET, {
      reason: reason || 'reset',
      boardBefore: before,
      boardAfter: this.board(),
    });
  }

  // PUBLIC_INTERFACE
  computerMoveStub(): void {
    /**
     * Computer move stub for future single-player mode.
     * For now, no-op with placeholder comment.
     */
    // Placeholder: In future, pick best move and call makeMove(bestIndex).
  }

  // BUSINESS LOGIC HELPERS

  private togglePlayer(): void {
    this.currentPlayer.set(this.currentPlayer() === 'X' ? 'O' : 'X');
  }

  private incrementScore(player: Player): void {
    const s = this.scores();
    if (player === 'X') {
      this.scores.set({ ...s, x: s.x + 1 });
    } else {
      this.scores.set({ ...s, o: s.o + 1 });
    }
  }

  private incrementDraw(): void {
    const s = this.scores();
    this.scores.set({ ...s, d: s.d + 1 });
  }

  private checkWinner(b: Cell[]): Cell {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, c, d] of lines) {
      if (b[a] !== '' && b[a] === b[c] && b[a] === b[d]) {
        return b[a];
      }
    }
    return '';
  }

  private isDraw(b: Cell[]): boolean {
    return b.every((x) => x !== '') && this.checkWinner(b) === '';
  }
}
