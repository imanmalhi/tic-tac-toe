import type { Board, AIMove } from "../types/game";

function formatBoard(board: Board): string {
    const rows = [
        board.slice(0, 3),
        board.slice(3, 6),
        board.slice(6, 9)
    ];
    return rows.map((row, i) => 
        row.map((cell, j) => cell ?? (i * 3 + j)).join(' | ')
    ).join('\n-----------\n');
}

function getAvailableMoves(board: Board): number[] {
    return board
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);
}

function findFallbackMove(board: Board): AIMove {
    const index = board.findIndex((cell) => cell === null);
    return { index, explanation: 'Making a move' };
}

function extractJSON(text: string): AIMove {
    const jsonMatch = text.match(/\{[\s\S]*?"index"[\s\S]*?"explanation"[\s\S]*?\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
}

function isValidMove(board: Board, index: number): boolean {
    return index >= 0 && index <= 8 && board[index] === null;
}

const SYSTEM_PROMPT = `You are an expert tic-tac-toe player playing as O. You must respond with ONLY a JSON object, nothing else: {"index": NUMBER, "explanation": "brief reason"}`;

export async function getAIMove(board: Board): Promise<AIMove> {
    const boardDisplay = formatBoard(board);
    const available = getAvailableMoves(board);

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
                max_tokens: 100,
                system: SYSTEM_PROMPT,
                messages: [
                    { 
                        role: 'user', 
                        content: `Board (0-8 positions, X and O are taken):\n${boardDisplay}\n\nAVAILABLE positions: ${available.join(', ')}\n\nPick ONE number from the available positions.` 
                    }
                ],
            }),
        });

        const data = await response.json();
        const content = data.content[0].text;
        const move = extractJSON(content);

        if (isValidMove(board, move.index)) {
            return move;
        }

        console.warn('AI returned invalid move:', move.index, 'Using fallback');
        return findFallbackMove(board);
    } catch (error) {
        console.error('AI move failed:', error);
        return findFallbackMove(board);
    }
}