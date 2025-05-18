import { Modal, ModalDialog, ModalClose, Typography, Select, Option, Button, Input, FormHelperText, FormControl } from "@mui/joy";
import { Chess } from "chess.js";
import { useState } from "react";
import { AIModel, AIModels } from "../chess";

export default function BasicModal({
    showBasicGame,
    setShowBasicGame,
    setGame,
    setAlert,
    black
}: any) {
    const [ai, setAI] = useState<AIModel | null>('stockfish-online');
    const [customFEN, setCustomFEN] = useState<string | undefined>();
    const [fenInvalid, setFENInvalid] = useState("");
    function capitalizeWords(str: string) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    function startGame() {
        try {
            const chess = new Chess(customFEN);
            setGame({
                chess,
                black: black,
                autoplay: null,
                ai: ((ai != null && ai != undefined)) ? {
                    model: ai
                } : undefined,
            });
            setAlert({
                message: "New game started",
                color: "#ddd",
                icon: "fa-chess",
            });
            setShowBasicGame(-1);
        } catch (err: any) {
            console.log("Invalid FEN", err);
            setFENInvalid(err.message.replace("Invalid FEN: ", ""));
        }
    }
    return (
        <Modal open={showBasicGame !== -1} onClose={() => setShowBasicGame(-1)}>
            <ModalDialog>
                <ModalClose />
                <Typography typography={'h4'}>Basic Game Setup</Typography>
                <Select
                    defaultValue={""}
                    onChange={(e, v) => {
                        if (v === "") {
                            setAI(null);
                        } else {
                            setAI(v as AIModel);
                        }
                    }}
                >
                    <Option value={""}>
                        Play against yourself
                    </Option>
                    {AIModels.map(model => (
                        <Option key={model} value={model}>
                            Play vs AI ({capitalizeWords(model.replace("-", " ")).replaceAll("Api", "API")})
                        </Option>
                    ))}
                </Select>
                <FormControl error={fenInvalid.length>0}>
                    <Input placeholder="FEN Setup (Optional)"
                        value={customFEN||""}
                        onChange={
                            (e) => {
                                setCustomFEN(e.target.value);
                            }
                        } />
                    {fenInvalid && <FormHelperText>{fenInvalid}</FormHelperText>}
                </FormControl>
                <Button
                    variant="solid"
                    color="primary"
                    onClick={() => {
                        startGame();
                    }}
                    sx={{
                        width: "100%",
                    }}
                >
                    Start Game
                </Button>
            </ModalDialog>
        </Modal>
    )
}