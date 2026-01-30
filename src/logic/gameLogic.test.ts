import { describe, it, expect } from 'vitest';
import { checkWinner, checkDraw, getInitialGameState, makeMove } from './gameLogic';

describe('checkWinner', () => {
    it('returns null for empty board', () => {
        const board = Array(9).fill(null);
        const result = checkWinner(board);
        expect(result.winner).toBeNull();
        expect(result.line).toBeNull();
    });

    it('detects horizontal win', () => {
        const board = ['X', 'X', 'X', null, null, null, null, null, null];
        const result = checkWinner(board);
        expect(result.winner).toBe('X');
        expect(result.line).toEqual([0, 1, 2]);
    });

    it('detects diagonal win', () => {
        const board = ['O', null, null, null, 'O', null, null, null, 'O'];
        const result = checkWinner(board);
        expect(result.winner).toBe('O');
        expect(result.line).toEqual([0, 4, 8]);
    });
});

describe('getInitialState', () => {
    it('returns correct inital state', () => {
        const state = getInitialGameState();
        expect(state.board).toEqual(Array(9).fill(null));
        expect(state.currentPlayer).toBe('X');
        expect(state.winner).toBeNull();
        expect(state.isDraw).toBe(false);
        expect(state.isGameOver).toBe(false);
        expect(state.winningLine).toBeNull();
    });
});

describe('checkDraw', () => {
    it('returns false for empty board', () => {
        const board = Array(9).fill(null);
        expect(checkDraw(board)).toBe(false);
    });

    it('returns true for full board', () => {
        const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
        expect(checkDraw(board)).toBe(true);
    });
});

describe('makeMove', () => {
    it('places mark and switches player', () => {
        const state = getInitialGameState();
        const next = makeMove(state, 0);
        expect(next.board[0]).toBe('X');
        expect(next.currentPlayer).toBe('O');
    });

    it ('ignores move on occupied cell', () => {
        const state = getInitialGameState();
        const after1 = makeMove(state, 0);
        const after2 = makeMove(after1, 0);
        expect(after2).toBe(after1);
    });
    it ('detects winner after winning move', () => {
        let state = getInitialGameState();
        state = makeMove(state, 0); // X
        state = makeMove(state, 3); // O
        state = makeMove(state, 1); // X
        state = makeMove(state, 4); // O
        state = makeMove(state, 2); // X wins top row
        expect(state.winner).toBe('X');
        expect(state.isGameOver).toBe(true);
        expect(state.winningLine).toEqual([0, 1, 2]);
    });
});