"use client";
import Image from "next/image";
import { Chess } from "chess.js";
import Chessboard, { elo, icons } from "./chess";
import { ReactNode, useState } from "react";
import { CssVarsProvider, Modal, ModalClose, ModalDialog, Select, Option, Typography, Slider, Button, Switch } from "@mui/joy";
import AIvsAIModal from "./modals/aivai";
import BasicModal from "./modals/basic";

export interface Alert {
    message: string;
    color: string;
    icon?: string;
};

export interface GameStyle {
    tiles: {
        light: string;
        dark: string;
    },
    piece: (color: string, piece: keyof typeof icons, handleDragStart?: any) => ReactNode;
}
export const AIModels = ['chess-api', 'stockfish-online'];
export type AIModel = typeof AIModels[number];
export interface Game {
    chess: Chess;
    black: boolean;
    autoplay: {
        depthA: number;
        depthB: number;
        delay: number;
    } | null;
    ai?: {
        model: AIModel;
    };
}

export const defaultStyles = {
    basic: {
        tiles: {
            light: "#e8e9cf",
            dark: "#769656",
        },
        piece(color: string, piece: keyof typeof icons, handleDragStart?: any) {
            return (
                <i
                    draggable
                    onDragStart={handleDragStart}
                    className={`fa-solid ${icons[piece]} chess-piece`}
                    style={{
                        color: color === 'w' ? '#fff' : '#000',
                        filter: `drop-shadow(0 0 5px #${color === 'w' ? '000' : 'fff'})`,
                    }}
                ></i>
            )
        }
    }
}

export default function Home() {
    const [alert, setAlert] = useState<Alert>({
        message: "",
        color: ""
    });
    const [game, setGame] = useState<Game | null>(null);

    const [showAIvsAI, setShowAIvsAI] = useState(false);
    const [showBasicGame, setShowBasicGame] = useState(-1);

    function newBasicGame(isBlack: boolean) {
        return () => {
            setShowBasicGame(isBlack ? 1 : 0);
        }
    }
    return (
        <CssVarsProvider defaultMode={'dark'}>
            <h1 suppressHydrationWarning className="klash-legacy title"><img src="/favicon.ico" /> Lazerstock</h1>
            <span>Powerful chess engine powered by Stockfish 17NNUE</span>
            {game ? (<>
                <span>{game.chess.turn() === 'w' ? 'White' : 'Black'}'s turn <span style={{ color: alert.color }}>{alert.icon && <i style={{ margin: '0 5px', padding: '0 5px', borderLeft: '1px solid #ddd' }} className={`fa-solid ${alert.icon}`}></i>}{alert.message}</span></span>
                <Chessboard game={game} setAlert={setAlert} style={defaultStyles.basic} />
            </>) : null}
            {!game && (<>
                <div className="line"></div>
                <i className={'klash-legacy'}>NEW GAME</i>
                <div className="tri-games">
                    <div className="game" onClick={newBasicGame(false)}>
                        <img src="/games/default.png" alt="" />
                        <span>Simple (White)</span>
                    </div>
                    <div className="game" onClick={newBasicGame(true)}>
                        <img src="/games/default-black.png" alt="" />
                        <span>Simple (Black)</span>
                    </div>
                    <div className="game" onClick={() => { setShowAIvsAI(true) }}>
                        <img src="/games/default.png" alt="" />
                        <span>AI vs AI</span>
                    </div>
                </div>
            </>)}
            {showAIvsAI && (
                <AIvsAIModal
                    showAIvsAI={showAIvsAI}
                    setShowAIvsAI={setShowAIvsAI}
                    setGame={setGame}
                    setAlert={setAlert}
                />
            )}
            {showBasicGame > -1 && (
                <BasicModal
                    showBasicGame={showBasicGame>-1}
                    setShowBasicGame={setShowBasicGame}
                    setGame={setGame}
                    setAlert={setAlert}
                    black={showBasicGame === 1}
                />
            )}
        </CssVarsProvider>
    );
}
