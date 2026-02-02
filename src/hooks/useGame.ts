import { useState, useEffect, useCallback } from "react";
import type { GameState, GameMode } from "../types/game";
import { getInitialState, makeMove } from "../logic/gameLogic";
import { getAIMove } from "../api/aiOpponent";

export function useGame() {
    const [gameState, setGameState] = useState<GameState>(getInitialState());
    const [gameMode, setGameMode] = useState<GameMode>('pvp');
    const [aiThinking, setAiThinking] = useState(false);
    const [aiExplanation, setAiExplanation] = useState('');

    const handleMove = useCallback((index: number): void => {
        setGameState((prev) => makeMove(prev, index));
    }, []);

    const resetGame = useCallback((): void => {
        setGameState(getInitialState());
        setAiExplanation('');
    }, []);

    const toggleGameMode = useCallback((): void => {
        setGameMode((prev) => (prev === 'pvp' ? 'ai' : 'pvp'));
        setGameState(getInitialState());
        setAiExplanation('');
    }, []);

    useEffect(() => {
        if (
            gameMode === 'ai' &&
            gameState.currentPlayer === 'O' &&
            !gameState.isGameOver &&
            !aiThinking
        ) {
            setAiThinking(true);

            getAIMove(gameState.board)
                .then((aiMove) => {
                    setGameState((prev) => makeMove(prev, aiMove.index));
                    setAiExplanation(aiMove.explanation);
                })
                .catch((error) => {
                    console.error('AI move error:', error);
                    setAiExplanation('AI encountered an error');
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
        toggleGameMode
    };
}