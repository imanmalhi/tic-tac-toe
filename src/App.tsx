import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import './App.css';

export function App(): React.ReactElement {
    const {
        gameState,
        gameMode,
        aiThinking,
        aiExplanation,
        handleMove,
        resetGame,
        toggleGameMode,
    } = useGame();

    const isBoardDisabled = aiThinking || gameState.isGameOver;

    return (
        <div className="app">
            <h1 className="title">Tic Tac Toe</h1>
            <p className="subtitle">
                {gameMode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}
            </p>

            <Board
                board={gameState.board}
                onCellClick={handleMove}
                winningLine={gameState.winningLine}
                disabled={isBoardDisabled}
            />

            <GameStatus
                gameState={gameState}
                gameMode={gameMode}
                aiThinking={aiThinking}
                aiExplanation={aiExplanation}
                onReset={resetGame}
                onToggleMode={toggleGameMode}
            />
        </div>
    );
}

export default App;
