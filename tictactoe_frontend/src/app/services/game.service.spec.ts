import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { AuditService } from './audit.service';
import { ActionType } from '../models/audit.models';

describe('GameService', () => {
  let game: GameService;
  let audit: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService, AuditService],
    });
    game = TestBed.inject(GameService);
    audit = TestBed.inject(AuditService);
  });

  it('should start with empty board and X as current player', () => {
    expect(game.board()).toEqual(['', '', '', '', '', '', '', '', '']);
    expect(game.currentPlayer()).toBe('X');
    expect(game.isGameOver()).toBeFalse();
  });

  it('should validate moves correctly', () => {
    expect(game.validateMove(0)).toBeTrue();
    expect(game.validateMove(-1)).toBeFalse();
    expect(game.validateMove(9)).toBeFalse();
    game.makeMove(0);
    expect(game.validateMove(0)).toBeFalse(); // already taken
  });

  it('should switch player after a valid move', () => {
    expect(game.currentPlayer()).toBe('X');
    const ok = game.makeMove(1);
    expect(ok).toBeTrue();
    expect(game.currentPlayer()).toBe('O');
  });

  it('should detect a win and stop further input', () => {
    // X wins with top row: 0,1,2
    expect(game.makeMove(0)).toBeTrue(); // X
    expect(game.makeMove(3)).toBeTrue(); // O
    expect(game.makeMove(1)).toBeTrue(); // X
    expect(game.makeMove(4)).toBeTrue(); // O
    expect(game.makeMove(2)).toBeTrue(); // X wins
    expect(game.isGameOver()).toBeTrue();
    expect(game.winner()).toBe('X');
    // board no longer accepts moves
    expect(game.makeMove(5)).toBeFalse();
  });

  it('should detect a draw', () => {
    game.reset('test');
    // Fill with a draw
    // X O X
    // X X O
    // O X O
    const seq = [0,1,2,5,3,6,4,8,7];
    for (const i of seq) game.makeMove(i);
    expect(game.isGameOver()).toBeTrue();
    expect(game.winner()).toBe(''); // draw
    expect(game.scores().d).toBeGreaterThanOrEqual(1);
  });

  it('should not allow invalid moves', () => {
    game.reset('test');
    expect(game.makeMove(0)).toBeTrue();
    // Try to play same cell
    expect(game.makeMove(0)).toBeFalse();
    // Out of range
    // @ts-expect-error testing invalid input
    expect(game.makeMove(99)).toBeFalse();
  });

  it('should reset the state and log audit RESET', () => {
    game.reset('pre-test');
    game.makeMove(0);
    const beforeEntries = audit.getEntries().length;
    game.reset('unit test reset');
    expect(game.board()).toEqual(['', '', '', '', '', '', '', '', '']);
    expect(game.currentPlayer()).toBe('X');
    expect(game.isGameOver()).toBeFalse();
    // Confirm RESET logged
    const afterEntries = audit.getEntries();
    const latest = afterEntries[0];
    expect(afterEntries.length).toBeGreaterThan(beforeEntries);
    expect(latest.action).toBe(ActionType.RESET);
    expect(latest.metadata?.reason).toBe('unit test reset');
    expect(latest.timestamp).toBeTruthy();
  });

  it('should log MOVE events with before/after snapshots', () => {
    game.reset('audit');
    const ok = game.makeMove(4);
    expect(ok).toBeTrue();
    const entry = audit.getEntries().find((e) => e.action === ActionType.MOVE);
    expect(entry).toBeTruthy();
    expect(entry!.metadata?.index).toBe(4);
    expect(entry!.metadata?.boardAfter?.[4]).toBe('X');
  });
});
