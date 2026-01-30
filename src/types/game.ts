export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type Board = CellValue[];

export interface GameState {
    board: Board;
    currentPlayer: Player;
    winner: Player | null;
    isDraw: boolean;
    isGameOver: boolean;
    winningLine: number[] | null;
}

export interface AIMove {
    index: number;
    explanation: string;
}

export type GameMode = 'pvp' | 'ai';