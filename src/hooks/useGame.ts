import { useState, useEffect, useCallback, useRef } from "react";
import type { GameState, GameMode } from "../types/game";
import { getInitialState, makeMove } from "../logic/gameLogic";
import { getAIMove } from "../api/aiOpponent";

export function useGame() {
    const [gameState, setGameState] = useState<GameState>(getInitialState());
    const [gameMode, setGameMode] = useState<GameMode>('pvp');
    const [aiThinking, setAiThinking] = useState(false);
    const [aiExplanation, setAiExplanation] = useState('');
    const aiMoveInProgress = useRef(false);

    const handleMove = useCallback((index: number): void => {
        setGameState((prev) => makeMove(prev, index));
    }, []);

    const resetGame = useCallback((): void => {
        setGameState(getInitialState());
        setAiExplanation('');
        aiMoveInProgress.current = false;
    }, []);

    const toggleGameMode = useCallback((): void => {
        setGameMode((prev) => (prev === 'pvp' ? 'ai' : 'pvp'));
        setGameState(getInitialState());
        setAiExplanation('');
        aiMoveInProgress.current = false;
    }, []);

    useEffect(() => {
        const isAITurn =
            gameMode === 'ai' &&
            gameState.currentPlayer === 'O' &&
            !gameState.isGameOver;

        if (isAITurn && !aiMoveInProgress.current) {
            aiMoveInProgress.current = true;
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
                    aiMoveInProgress.current = false;
                });
        }
    }, [gameMode, gameState.currentPlayer, gameState.isGameOver, gameState.board]);

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