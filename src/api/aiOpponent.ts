import type { Board, AIMove } from '../types/game';

function formatBoard(board: Board): string {
    return [
        board.slice(0, 3),
        board.slice(3, 6),
        board.slice(6, 9)
    ].map((row, rowIndex) => row.map((cell, colIndex) => cell ?? (rowIndex * 3 + colIndex)).join(' | ')).join('\n-------\n');
}

const SYSTEM_PROMPT = `You are playing tick-tac-toe as 0 against a human player X. Analyze the board and make the optimal move. Respond with JSON only.`;

function buildUserPrompt(boardDisplay: string): string {
    return `Current board (numbers are emptry positions):

    ${boardDisplay}

    Chose your move. Respond with exactly this JSON format, no other text: {"index": <number 0-8>, "explanation": <one sentence>}

    Prioritize: 1) Win if possible 2) Block X from winning 3) Take center 4) Take corner 5) Take any open space`;
}

export async function getAIMove(board: Board): Promise<AIMove> {
    const boardDisplay = formatBoard(board);
    const userPrompt = buildUserPrompt(boardDisplay);

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 150,
                system: SYSTEM_PROMPT,
                messages: [{ role: 'user', content: userPrompt }],
            }),
        });

        const data = await response.json();
        return JSON.parse(data.content[0].text) as AIMove;
    } catch (error) {
        console.error('AI move failed:', error);
        const fallbackIndex = board.findIndex((cell) => cell === null);
        return { index: fallbackIndex, explanation: 'Fallback move: AI unavailable' };
    }
}