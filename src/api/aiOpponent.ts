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

function extractJSON(text: string, board: Board): AIMove {
    const jsonRegex = /\{"index":\s*(\d+),\s*"explanation":\s*"[^"]*"\}/g;
    let match;
    while ((match = jsonRegex.exec(text)) !== null) {
        const parsed: AIMove = JSON.parse(match[0]);
        if (isValidMove(board, parsed.index)) {
            return parsed;
        }
    }
    throw new Error('No valid JSON with legal move found in response');
}

function isValidMove(board: Board, index: number): boolean {
    return index >= 0 && index <= 8 && board[index] === null;
}

const WIN_LINES: number[][] = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function findWinningMove(board: Board, player: 'X' | 'O'): number | null {
    for (const line of WIN_LINES) {
        const cells = line.map(i => board[i]);
        const playerCount = cells.filter(c => c === player).length;
        const emptyIndex = line.find(i => board[i] === null);
        if (playerCount === 2 && emptyIndex !== undefined) {
            return emptyIndex;
        }
    }
    return null;
}

const SYSTEM_PROMPT = `You play tic-tac-toe as O. Win lines: [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]. Pick the best strategic move from the available positions.`;

export async function getAIMove(board: Board): Promise<AIMove> {
    const boardDisplay = formatBoard(board);
    const available = getAvailableMoves(board);

    const winMove = findWinningMove(board, 'O');
    if (winMove !== null) {
        return { index: winMove, explanation: 'Taking the winning move!' };
    }

    const blockMove = findWinningMove(board, 'X');
    if (blockMove !== null) {
        return { index: blockMove, explanation: 'Blocking X from winning.' };
    }

    try {
        const requestBody = {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 100,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: `Board:\n${boardDisplay}\n\nAvailable positions: ${available.join(', ')}\n\nYou MUST pick one of the available positions listed above. Respond with ONLY valid JSON, no other text: {"index": N, "explanation": "reason"}`
                }
            ],
        };

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        const content = data.content[0].text;
        const move = extractJSON(content, board);
        return move;
    } catch (error) {
        console.error('AI move failed:', error);
        return findFallbackMove(board);
    }
}
