"use client";
import { Button } from "@mui/joy";
import { Chess } from "chess.js";
import { CSSProperties, useEffect, useState } from "react";
import { Alert, Game, GameStyle } from "./page";
import ChessAPI from "./apis/API";
import CAChessApi from "./apis/APIChessApi";
import CAStockfishOnline from "./apis/APIStockfishOnline";

export const icons = {
    'p': 'fa-chess-pawn',
    'r': 'fa-chess-rook',
    'n': 'fa-chess-knight',
    'b': 'fa-chess-bishop',
    'q': 'fa-chess-queen',
    'k': 'fa-chess-king'
};
export const elo = {
    '300': 1,
    '500': 2,
    '750': 3,
    '1000': 4,
    '1200': 5,
    '1500': 7,
    '2000': 10,
    '2350': 12,
    '2750': 18
}; 

function Square({ piece, position, movePiece, style }: { piece: any, style: GameStyle, position: string, movePiece: (from: string, to: string) => void }) {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("from", position);
    };

    const handleDrop = (e: React.DragEvent) => {
        const from = e.dataTransfer.getData("from");
        movePiece(from, position);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="chessboard-square"
            style={{
                backgroundColor: (parseInt(position[1]) + position.charCodeAt(0)) % 2 === 0 ? style.tiles.light : style.tiles.dark,
            }}
        >
            {piece?.type && <>
                {style.piece(piece.color, piece.type, handleDragStart)}
            </>}
        </div>
    );
}

export default function Chessboard({ game, setAlert, style }: { game: Game, setAlert: (_:Alert)=>void, style: GameStyle }) {
    const [chess] = useState(game.chess);
    const [isBlack] = useState(game.black);
    const [autoplay] = useState(game.autoplay);
    const [b, setBoard] = useState(chess.board());
    const [eloLevel, setEloLevel] = useState<keyof typeof elo>("2350");
    
    const [api, setApi] = useState<ChessAPI|null>(null);

    function moveStockfish({forceDepth=null}: {forceDepth?: number|null} = {}) {
        if(api) {
            api.getMove(chess.fen(), forceDepth || elo[eloLevel]).then((result: { from: string; to: string; move: string }|string) => {
                if (typeof result === 'string') {
                    setAlert({
                        message: result,
                        color: "#f00",
                        icon: "fa-solid fa-exclamation-triangle",
                    });
                    return;
                }
                const { from, to, move } = result;
                chess.move(move);
                setBoard([...chess.board()]);
                setAlert({
                    message: `Stockfish moved ${from} > ${to}`,
                    color: "#ddd",
                    icon: "fa-chess",
                });
            });
        }
    }

    const movePiece = (from: string, to: string) => {
        if(from === to || chess.isGameOver()) return;
        try {
            const move = chess.move({ from, to, promotion: 'q' });
            if (move) {
                setBoard([...chess.board()]);
                setAlert({
                    message: `You moved ${from} > ${to}`,
                    color: "#ddd",
                    icon: "fa-chess",
                });
            }
            moveStockfish();
        } catch(err) {
            console.log("Invalid move", err);
            setAlert({
                message: "Invalid move",
                color: "#f00",
                icon: "fa-solid fa-exclamation-triangle",
            });
        }
    };

    useEffect(() => {
        if(game.ai) {
            if(game.ai.model === 'stockfish-online') {
                setApi(new CAStockfishOnline());
            } else if(game.ai.model === 'chess-api') {
                setApi(new CAChessApi());
            }
        }
        if (isBlack || autoplay) {
            moveStockfish();
        }
    },[]);

    useEffect(() => {
        var message = '';
        if (chess.isCheck()) {
            message = 'Check!';
        }
        if (chess.isCheckmate()) {
            message = 'Checkmate!';
        }
        if (chess.isStalemate()) {
            message = 'Stalemate!';
        }
        if (chess.isDraw()) {
            message = 'Draw!';
        }
        if(chess.isGameOver()) {
            message += ' - Game Over'
        }
        if (message) {
            setAlert({
                message,
                color: "#f00",
                icon: "fa-solid fa-exclamation-triangle",
            });
        }
    }, [chess.board, b]);

    return (
        <div className="chesssplit">
            <div className="chessboard">
                {(isBlack ? [...chess.board()].reverse() : chess.board()).map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="chessboard-row">
                            {(isBlack ? [...row].reverse() : row).map((piece, colIndex) => {
                                const position = isBlack
                                    ? `${String.fromCharCode(104 - colIndex)}${rowIndex + 1}`
                                    : `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
                                return (
                                    <Square
                                        style={style}
                                        key={position}
                                        piece={piece}
                                        position={position}
                                        movePiece={movePiece}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {(game.ai) && (
                <div className="chess-options">
                    <Button onClick={()=>{setEloLevel("300")}} color={eloLevel === '300' ? 'success' : 'primary'}>300</Button>
                    <Button onClick={()=>{setEloLevel("500")}} color={eloLevel === '500' ? 'success' : 'primary'}>500</Button>
                    <Button onClick={()=>{setEloLevel("750")}} color={eloLevel === '750' ? 'success' : 'primary'}>750</Button>
                    <Button onClick={()=>{setEloLevel("1000")}} color={eloLevel === '1000' ? 'success' : 'primary'}>1000</Button>
                    <Button onClick={()=>{setEloLevel("1200")}} color={eloLevel === '1200' ? 'success' : 'primary'}>1200</Button>
                    <Button onClick={()=>{setEloLevel("1500")}} color={eloLevel === '1500' ? 'success' : 'primary'}>1500</Button>
                    <Button onClick={()=>{setEloLevel("2000")}} color={eloLevel === '2000' ? 'success' : 'primary'}>2000</Button>
                    <Button onClick={()=>{setEloLevel("2350")}} color={eloLevel === '2350' ? 'success' : 'primary'}>2350</Button>
                    <Button onClick={()=>{setEloLevel("2750")}} disabled={game.ai.model==='stockfish-online'} color={eloLevel === '2750' ? 'success' : 'primary'}>2750</Button>
                </div>
            )}
        </div>
    );
}
