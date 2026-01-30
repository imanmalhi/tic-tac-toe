import type { CellValue } from '../types/game';
import styles from './Cell.module.css';

interface CellProps {
    value: CellValue;
    onClick: () => void;
    disabled: boolean;
    isWinningCell: boolean;
}

export function Cell({ value, onClick, disabled, isWinningCell }: CellProps) {
    const classNames  =[
        styles.cell,
        value === 'X' ? styles.x : '',
        value === 'O' ? styles.o : '',
        isWinningCell ? styles.winningCell : '',
    ].filter(Boolean).join(' ');

    return (
        <button className={classNames} onClick={onClick} disabled={disabled || value !== null}>
            {value}
        </button>
    );
}
