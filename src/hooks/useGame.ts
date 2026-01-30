import { useState, useEffect, useCallback } from 'react';
import { GameState, GameMode } from '../types/game';
import { getInitialGameState, makeMove } from '../logic/gameLogic';
import { getAIMove } from '../api/aiOpponent';

interface UseGameReturn {
    gameState: GameState;
    gameMode: GameMode;
    aiThinking: boolean;
    aiExplanation: string;
    handleMove: (index: number) => void;
    resetGame: () => void;
    toggleGameMode: () => void;
}

export function useGame(): UseGameReturn {
    const [gameState, setGameState] = useState<GameState>(getInitialGameState());
    const [gameMode, setGameMode] = useState<GameMode>('pvp');
    const [aiThinking, setAiThinking] = useState(false);
    const [aiExplanation, setAiExplanation] = useState('');

    const handleMove = useCallback((index: number): void => {
        setGameState((current) => makeMove(current, index));
    }, []);

    const resetGame = useCallback((): void => {
        setGameState(getInitialGameState());
        setAiExplanation('');
    }, []);

    const toggleGameMode = useCallback((): void => {
        setGameMode((current) => (current === 'pvp' ? 'ai' : 'pvp'));
        setGameState(getInitialGameState());
        setAiExplanation('');
    }, []);

    useEffect(() => {
        if (gameMode === 'ai' && gameState.currentPlayer === 'O' && !gameState.isGameOver && !aiThinking) {
            setAiThinking(true);
            getAIMove(gameState.board)
                .then((aiMove) => {
                    setGameState((current) => makeMove(current, aiMove.index));
                    setAiExplanation(aiMove.explanation);
                })
                .catch((error) => {
                    console.error('AI move error:', error);
                })
                .finally(() => {
                    setAiThinking(false);
                });
        }
    }, [gameMode, gameState.currentPlayer, gameState.isGameOver, gameState.board, aiThinking]);

    return {
        gameState,
        gameMode,
        aiThinking,
        aiExplanation,
        handleMove,
        resetGame,
        toggleGameMode,
    };
}