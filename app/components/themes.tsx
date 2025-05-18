import { GameStyle, icons } from "../chess"

export const pieceSets = {
    sky: (color: string, piece: keyof typeof icons) => {
        return `https://images.chesscomfiles.com/chess-themes/pieces/sky/150/${color}${piece}.png`;
    }
}

export const defaultStyles: Record<string, GameStyle> = {
    'basic': {
        tiles: {
            light: "#e8e9cf",
            dark: "#769656",
        },
        piece(color: string, piece: keyof typeof icons, handleDragStart?: any) {
            return (
                <div
                    className="chess-piece-box"
                    draggable={handleDragStart ? true : false}
                    onDragStart={handleDragStart}>
                    <i
                        className={`fa-solid ${icons[piece]} chess-piece`}
                        style={{
                            color: color === 'w' ? '#fff' : '#000',
                            filter: `drop-shadow(0 0 5px #${color === 'w' ? '000' : 'fff'})`,
                        }}
                    ></i>
                </div>
            )
        }
    },
    'blue': {
        tiles: {
            light: "#a2d2ff",
            dark: "#003566",
        },
        piece(color: string, piece: keyof typeof icons, handleDragStart?: any) {
            return (
                <div
                    className="chess-piece-box"
                    draggable={handleDragStart ? true : false}
                    onDragStart={handleDragStart}>
                    <i
                        className={`fa-solid ${icons[piece]} chess-piece`}
                        style={{
                            color: color === 'w' ? '#d4f1f4' : '#001d3d',
                            filter: `drop-shadow(0 0 5px #${color === 'w' ? '001d3d' : 'd4f1f4'})`,
                        }}
                    ></i>
                </div>
            )
        }
    },
    'wood': {
        tiles: {
            light: "#f3eac2",
            dark: "#8b5e3c",
        },
        piece(color: string, piece: keyof typeof icons, handleDragStart?: any) {
            return (
                <div
                    className="chess-piece-box"
                    draggable={handleDragStart ? true : false}
                    onDragStart={handleDragStart}>
                    <i
                        className={`fa-solid ${icons[piece]} chess-piece`}
                        style={{
                            color: color === 'w' ? '#fff5e1' : '#5a3d2b',
                            filter: `drop-shadow(0 0 5px #${color === 'w' ? '5a3d2b' : 'fff5e1'})`,
                        }}
                    ></i>
                </div>
            )
        }
    },
    'sky': {
        tiles: {
            light: "#d9e4e8",
            dark: "#7296ab",
        },
        piece(color: string, piece: keyof typeof icons, handleDragStart?: any) {
            return (
                <div
                    className="chess-piece-box"
                    draggable={handleDragStart ? true : false}
                    onDragStart={handleDragStart}>
                    <img
                        className={`chess-piece`}
                        src={pieceSets.sky(color, piece)}
                        style={{
                            filter: `drop-shadow(0 0 5px #${color === 'w' ? '5a3d2b' : 'fff5e1'})`,
                        }}
                    ></img>
                </div>
            )
        }
    }
}