import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import './App.css';

function App() {
    const { gameState, gameMode, aiThinking, aiExplanation, handleMove, resetGame, toggleGameMode } = useGame();

    return (
        <div className="app">
            <h1>Tic-Tac-Toe</h1>
            <p className="subtitle">
                {gameMode === 'ai' ? 'Playing against AI' : 'Two player mode'}
            </p>
            <Board
                board={gameState.board}
                onCellClick={handleMove}
                winningLine={gameState.winningLine}
                disabled={aiThinking || gameState.isGameOver}
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
