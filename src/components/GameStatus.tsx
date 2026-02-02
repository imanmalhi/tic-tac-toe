import type { ReactElement } from 'react';
import type { GameState, GameMode } from '../types/game';
import styles from './GameStatus.module.css';

interface GameStatusProps {
    gameState: GameState;
    gameMode: GameMode;
    aiThinking: boolean;
    aiExplanation: string;
    onReset: () => void;
    onToggleMode: () => void;
}

function getStatusText(gameState: GameState, aiThinking: boolean): string {
    if (gameState.winner) {
        return `Player ${gameState.winner} wins!`;
    }
    if (gameState.isDraw) {
        return "It's a draw!";
    }
    if (aiThinking) {
        return 'AI thinking';
    }
    return `Player ${gameState.currentPlayer}'s turn`;
}

export function GameStatus({
    gameState,
    gameMode,
    aiThinking,
    aiExplanation,
    onReset,
    onToggleMode,
}: GameStatusProps): ReactElement {
    const statusText = getStatusText(gameState, aiThinking);

    return (
        <div className={styles.container}>
            <div className={`${styles.status} ${aiThinking ? styles.dots : ''}`}>
                {statusText}
            </div>

            {aiExplanation && (
                <div className={styles.explanation}>{aiExplanation}</div>
            )}

            <div className={styles.buttons}>
                <button className={styles.button} onClick={onReset}>
                    New Game
                </button>
                <button className={styles.buttonSecondary} onClick={onToggleMode}>
                    {gameMode === 'pvp' ? 'Play vs AI' : 'Play vs Human'}
                </button>
            </div>
        </div>
    );
}
