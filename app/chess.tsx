"use client";
import { Button } from "@mui/joy";
import { Chess } from "chess.js";
import { CSSProperties, useState } from "react";

const icons = {
    'p': 'fa-chess-pawn',
    'r': 'fa-chess-rook',
    'n': 'fa-chess-knight',
    'b': 'fa-chess-bishop',
    'q': 'fa-chess-queen',
    'k': 'fa-chess-king'
};
const elo = {
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

function Square({ piece, position, movePiece }: { piece: any, position: string, movePiece: (from: string, to: string) => void }) {
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
                backgroundColor: (parseInt(position[1]) + position.charCodeAt(0)) % 2 === 0 ? '#e8e9cf' : '#739552',
            }}
        >
            {piece?.type && (
                <i
                    draggable
                    onDragStart={handleDragStart}
                    className={`fa-solid ${icons[piece.type as keyof typeof icons]} chess-piece`}
                    style={{
                        color: piece.color === 'b' ? 'black' : 'white',
                        '--effect-color': piece.color === 'b' ? '#ccc' : '#333',
                    } as CSSProperties}
                ></i>
            )}
        </div>
    );
}

export default function Chessboard({ game }: { game: Chess }) {
    const [chess] = useState(game);
    const [, setBoard] = useState(chess.board());
    const [eloLevel, setEloLevel] = useState<keyof typeof elo>("2350");

    const movePiece = (from: string, to: string) => {
        try {
            const move = chess.move({ from, to, promotion: 'q' });
            if (move) {
                setBoard([...chess.board()]);
            }
            fetch("https://chess-api.com/v1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fen: chess.fen(),
                    depth: elo[eloLevel],
                    elo: eloLevel,
                }),
            }).then((res) => res.json()).then((data) => {
                chess.move(data.move);
                setBoard([...chess.board()]);
            })
        } catch(err) {
            console.error("Invalid move", err);
        }
    };

    return (
        <div className="chesssplit">
            <div className="chessboard">
                {chess.board().map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="chessboard-row">
                            {row.map((piece, colIndex) => {
                                const position = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
                                return (
                                    <Square
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
            <div className="chess-options">
                <Button onClick={()=>{setEloLevel("300")}} color={eloLevel === '300' ? 'success' : 'primary'}>300</Button>
                <Button onClick={()=>{setEloLevel("500")}} color={eloLevel === '500' ? 'success' : 'primary'}>500</Button>
                <Button onClick={()=>{setEloLevel("750")}} color={eloLevel === '750' ? 'success' : 'primary'}>750</Button>
                <Button onClick={()=>{setEloLevel("1000")}} color={eloLevel === '1000' ? 'success' : 'primary'}>1000</Button>
                <Button onClick={()=>{setEloLevel("1200")}} color={eloLevel === '1200' ? 'success' : 'primary'}>1200</Button>
                <Button onClick={()=>{setEloLevel("1500")}} color={eloLevel === '1500' ? 'success' : 'primary'}>1500</Button>
                <Button onClick={()=>{setEloLevel("2000")}} color={eloLevel === '2000' ? 'success' : 'primary'}>2000</Button>
                <Button onClick={()=>{setEloLevel("2350")}} color={eloLevel === '2350' ? 'success' : 'primary'}>2350</Button>
                <Button onClick={()=>{setEloLevel("2750")}} color={eloLevel === '2750' ? 'success' : 'primary'}>2750</Button>
            </div>
        </div>
    );
}
