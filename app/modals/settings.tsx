import React from 'react';
import { Modal, ModalDialog, ModalClose, Typography, FormControl, Input, FormHelperText, Switch } from '@mui/joy';
import { defaultStyles } from '../components/themes';
import { useTheme } from '../contexts/theme';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [theme, setTheme] = useTheme();
    
    return (
        <Modal open={isOpen} onClose={onClose}>
            <ModalDialog>
                <ModalClose onClick={onClose} />
                <Typography typography="h4">Settings</Typography>
                {Object.keys(defaultStyles).reduce((rows, style, index) => {
                    if (index % 3 === 0) rows.push([]);
                    rows[rows.length - 1].push(style);
                    return rows;
                }, [] as string[][]).map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        {row.map((style) => (
                            <div className={`theme ${style===theme.value?'active':''}`} key={style} onClick={()=>{
                                setTheme({value: style});
                            }}>
                                <div className="chessboard view">
                                    <div className="chessboard-row">
                                        <div className="chessboard-square" style={{background: defaultStyles[style].tiles.light}}>
                                            {defaultStyles[style].piece('b', 'n')}
                                        </div>
                                        <div className="chessboard-square" style={{background: defaultStyles[style].tiles.dark}}>
                                            {defaultStyles[style].piece('w', 'n')}
                                        </div>
                                    </div>
                                    <div className="chessboard-row">
                                        <div className="chessboard-square" style={{background: defaultStyles[style].tiles.dark}}>
                                            {defaultStyles[style].piece('b', 'p')}
                                        </div>
                                        <div className="chessboard-square" style={{background: defaultStyles[style].tiles.light}}>
                                            {defaultStyles[style].piece('w', 'p')}
                                        </div>
                                    </div>
                                </div>
                                <span>{style}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </ModalDialog>
        </Modal>
    );
};

export default SettingsModal;