import type { Board as BoardType } from "../types/game";
import { Cell } from "./Cell";
import styles from './Board.module.css';

interface BoardProps {
    board: BoardType;
    onCellClick: (index: number) => void;
    winningLine: number[] | null;
    disabled: boolean;
}

export function Board({board, onCellClick, winningLine, disabled}: BoardProps) {
    return (
        <div className={styles.board}>
            {board.map((value, index) => (
                <Cell
                    key={index}
                    value={value}
                    onClick={() => onCellClick(index)}
                    disabled={disabled}
                    isWinningCell={winningLine?.includes(index) ?? false}
                />
            ))}
        </div>
    )
}