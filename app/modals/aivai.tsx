"use client";
import React, { useState } from 'react';
import { Modal, ModalDialog, ModalClose, Typography, Select, Option, Slider, Switch, Button } from '@mui/joy';
import { Chess } from 'chess.js';
import { AIModel, AIModels, elo, Game } from '../chess';
import { capitalizeWords } from './basic';

interface AIvsAIModalProps {
    showAIvsAI: boolean;
    setShowAIvsAI: (value: boolean) => void;
    setGame: (game: Game) => void;
    setAlert: (alert: { message: string; color: string; icon: string }) => void;
}

export default function AIvsAIModal({
    showAIvsAI,
    setShowAIvsAI,
    setGame,
    setAlert,
}: AIvsAIModalProps) {
    const [AvAeloA, setAvAeloA] = useState<keyof typeof elo>("2350");
    const [AvAeloB, setAvAeloB] = useState<keyof typeof elo>("2350");
    const [AvAeloDelay, setAvAeloDelay] = useState(100);
    const [AvAblack, setAvABlack] = useState(false);
    const [AvAmodel, setAvAModel] = useState<AIModel>('stockfish-online');
    return (
        <Modal open={showAIvsAI} onClose={() => setShowAIvsAI(false)}>
            <ModalDialog>
                <ModalClose />
                <Typography typography={'h4'}>AIvAI Game Setup</Typography>
                <Select
                    defaultValue={"stockfish-online"}
                    onChange={(e, v) => {
                        setAvAModel(v as AIModel);
                    }}
                >
                    {AIModels.map(model => (
                        <Option key={model} value={model}>
                            Model: {capitalizeWords(model.replace("-", " ")).replaceAll("Api", "API")}
                        </Option>
                    ))}
                </Select>
                <Select
                    defaultValue="2350"
                    onChange={(e, v) => {
                        setAvAeloA((v || '2350') as keyof typeof elo);
                    }}
                >
                    {Object.keys(elo).map((eloKey) => (
                        <Option key={eloKey} value={eloKey}>
                            {eloKey} elo (white)
                        </Option>
                    ))}
                </Select>
                <Select
                    defaultValue="2350"
                    onChange={(e, v) => {
                        setAvAeloB((v || '2350') as keyof typeof elo);
                    }}
                >
                    {Object.keys(elo).map((eloKey) => (
                        <Option key={eloKey} value={eloKey}>
                            {eloKey} elo (black)
                        </Option>
                    ))}
                </Select>
                <Slider
                    defaultValue={100}
                    min={10}
                    max={2000}
                    step={10}
                    valueLabelDisplay="on"
                    valueLabelFormat={(value) => `${value}ms move delay`}
                    onChange={(e, v) => {
                        setAvAeloDelay(v as number);
                    }}
                    sx={{
                        width: '100%',
                        margin: '10px 0',
                    }}
                />
                <Typography
                    sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                    component="label"
                    endDecorator={
                        <Switch
                            onChange={(e) => {
                                setAvABlack(e.target.checked);
                            }}
                            size={'lg'}
                        ></Switch>
                    }
                >
                    View as Black
                </Typography>
                <Button
                    variant="solid"
                    color="primary"
                    onClick={() => {
                        const chess = new Chess();
                        setGame({
                            chess,
                            black: AvAblack,
                            autoplay: {
                                depthA: elo[AvAeloA],
                                depthB: elo[AvAeloB],
                                delay: AvAeloDelay,
                            },
                            ai: {
                                model: AvAmodel,
                            }
                        });
                        setAlert({
                            message: 'New game started',
                            color: '#ddd',
                            icon: 'fa-chess',
                        });
                        setShowAIvsAI(false);
                    }}
                >
                    Begin Game
                </Button>
            </ModalDialog>
        </Modal>
    );
}