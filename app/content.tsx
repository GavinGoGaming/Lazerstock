"use client";
import Image from "next/image";
import { Chess } from "chess.js";
import Chessboard, { Alert, elo, Game, icons } from "./chess";
import { ReactNode, useState } from "react";
import { CssVarsProvider, Modal, ModalClose, ModalDialog, Select, Option, Typography, Slider, Button, Switch, IconButton } from "@mui/joy";
import AIvsAIModal from "./modals/aivai";
import BasicModal from "./modals/basic";
import useLocalStorage from "./hooks/localstorage";
import { useTheme } from "./contexts/theme";
import SettingsModal from "./modals/settings";
import { defaultStyles } from "./components/themes";

export default function Content() {
    const [alert, setAlert] = useState<Alert>({
        message: "",
        color: ""
    });
    const [game, setGame] = useState<Game | null>(null);

    const [theme, setTheme] = useTheme();

    const [showAIvsAI, setShowAIvsAI] = useState(false);
    const [showBasicGame, setShowBasicGame] = useState(-1);
    const [showSettings, setShowSettings] = useState(false);

    function newBasicGame(isBlack: boolean) {
        return () => {
            setShowBasicGame(isBlack ? 1 : 0);
        }
    }
    return <>
        <div className="header">
            <span className="klash-legacy">Lazerstock</span>
            <IconButton variant="outlined" onClick={()=>{setShowSettings(true)}}><i className="fas fa-gear"></i></IconButton>
            <IconButton variant="outlined" onClick={()=>{setGame(null)}}><i className="fas fa-home"></i></IconButton>
        </div>
        <main>
            <h1 suppressHydrationWarning className="klash-legacy title"><img src="/favicon.ico" /> Lazerstock</h1>
            <span>Powerful chess engine powered by Stockfish 17NNUE</span>
            <div className="line"></div>
            {game ? (<>
                <span>{game.chess.turn() === 'w' ? 'White' : 'Black'}'s turn <span style={{ color: alert.color }}>{alert.icon && <i style={{ margin: '0 5px', padding: '0 5px', borderLeft: '1px solid #ddd' }} className={`fa-solid ${alert.icon}`}></i>}{alert.message}</span></span>
                <Chessboard game={game} setAlert={setAlert} style={defaultStyles[theme?.value || 'basic']} />
            </>) : null}
            {!game && (<>
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
                    showBasicGame={showBasicGame > -1}
                    setShowBasicGame={setShowBasicGame}
                    setGame={setGame}
                    setAlert={setAlert}
                    black={showBasicGame === 1}
                />
            )}
            <SettingsModal isOpen={showSettings} onClose={() => { setShowSettings(false) }} />
        </main>
    </>
}