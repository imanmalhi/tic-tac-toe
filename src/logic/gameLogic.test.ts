import { describe, it, expect } from 'vitest';
import { checkWinner, checkDraw, getInitialState, makeMove } from './gameLogic';
import type { Board } from '../types/game';

describe('checkWinner', () => {
    it('returns null for empty board', () => {
        const board = Array(9).fill(null);
        const result = checkWinner(board);
        expect(result.winner).toBeNull();
        expect(result.line).toBeNull();
    });

    it('detects horizontal win', () => {
        const board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
        const result = checkWinner(board);
        expect(result.winner).toBe('X');
        expect(result.line).toEqual([0, 1, 2]);
    });

    it('detects diagonal win', () => {
        const board: Board = ['O', null, null, null, 'O', null, null, null, 'O'];
        const result = checkWinner(board);
        expect(result.winner).toBe('O');
        expect(result.line).toEqual([0, 4, 8]);
    });
});

describe('checkDraw', () => {
    it('returns false for empty board', () => {
        const board = Array(9).fill(null);
        expect(checkDraw(board)).toBe(false);
    });

    it('returns true for full board', () => {
        const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
        expect(checkDraw(board)).toBe(true);
    });
});

describe('getInitialState', () => {
    it('returns correct inital state', () => {
        const state = getInitialState();
        expect(state.board).toEqual(Array(9).fill(null));
        expect(state.currentPlayer).toBe('X');
        expect(state.winner).toBeNull();
        expect(state.isDraw).toBe(false);
        expect(state.isGameOver).toBe(false);
        expect(state.winningLine).toBeNull();
    });
});

describe('makeMove', () => {
    it('places mark and switches player', () => {
        const state = getInitialState();
        const newState = makeMove(state, 0);
        expect(newState.board[0]).toBe('X');
        expect(newState.currentPlayer).toBe('O');
    });

    it('ignores move on occupied cell', () => {
        const state = getInitialState();
        const afterFirst = makeMove(state, 0);
        const afterSecond = makeMove(afterFirst, 0);
        expect(afterSecond).toBe(afterFirst);
    });

    it('detects winner after winning move', () => {
        let state = getInitialState();
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

