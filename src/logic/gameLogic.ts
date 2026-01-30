import type { Board, Player, GameState } from '../types/game';

export const WINNING_LINES: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function checkWinner(board: Board): { winner: Player | null; line: number[] | null } {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a] as Player, line };
        }
    }
    return { winner: null, line: null };
}

export function checkDraw(board: Board): boolean {
    return board.every((cell) => cell !== null);
}

export function getInitialGameState(): GameState {
    return {
        board: Array(9).fill(null),
        currentPlayer: 'X',
        winner: null,
        isDraw: false,
        isGameOver: false,
        winningLine: null,
    };
}

export function makeMove(state: GameState, index: number): GameState {
    if (state.board[index] !== null || state.isGameOver) {
        return state;
    }

    const newBoard = [...state.board];
    newBoard[index] = state.currentPlayer;

    const { winner, line } = checkWinner(newBoard);
    const isDraw = winner === null && checkDraw(newBoard);
    const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X';

    return {
        board: newBoard,
        currentPlayer: nextPlayer,
        winner,
        isDraw,
        isGameOver: winner !== null || isDraw,
        winningLine: line,
    };
}