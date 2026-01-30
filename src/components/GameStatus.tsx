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
        return 'AI is thinking';
    }
    return `Player ${gameState.currentPlayer}'s turn`;
}

export function GameStatus({ gameState, gameMode, aiThinking, aiExplanation, onReset, onToggleMode }: GameStatusProps) {
    return (
        <div className={styles.container}>
            <p className={styles.status}>
                {getStatusText(gameState, aiThinking)}
                {aiThinking && <span className={styles.dots}>...</span>}
            </p>
            {aiExplanation && (
                <div className={styles.explanation}>
                    <strong>AI:</strong> {aiExplanation}
                </div>
            )}
            <div className={styles.buttons}>
                <button onClick={onReset}>New Game</button>
                <button onClick={onToggleMode}>
                    {gameMode === 'pvp' ? 'Play vs AI' : 'Play vs Human'}
                </button>
            </div>
        </div>
    );
}
