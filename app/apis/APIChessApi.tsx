import ChessAPI from "./API";

/**
 * fetch("https://chess-api.com/v1", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify({
                 fen: chess.fen(),
                 depth: forceDepth || elo[eloLevel]
             }),
         }).then((res) => res.json()).then((data) => {
             if(data.move) {
                 chess.move(data.move);
                 setAlert({
                     message: `Opponent moved ${data.from} > ${data.to}`,
                     color: "#ddd",
                     icon: "fa-chess",
                 });
                 if(chess.isCheckmate()) {
                     setAlert({
                         message: "Checkmate!",
                         color: "#f00",
                         icon: "fa-solid fa-chess-king",
                     });
                 } else if(chess.isStalemate()) {
                     setAlert({
                         message: "Stalemate!",
                         color: "#f00",
                         icon: "fa-solid fa-chess-king",
                     });
                 } else if(chess.isDraw()) {
                     setAlert({
                         message: "Draw!",
                         color: "#f00",
                         icon: "fa-solid fa-chess-king",
                     });
                 } else {
                     if(autoplay) {
                         setTimeout(() => {
                             moveStockfish({forceDepth: (
                                 chess.turn() === 'w' ? autoplay.depthA : autoplay.depthB
                             )});
                         }, 0);
                     }
                 }
                 setBoard([...chess.board()]);
             } else {
                 console.log("Stockfish error (didn't play)", data);
                 setAlert({
                     message: "Stockfish error (didn't play)",
                     color: "#ddd",
                     icon: "fa-chess",
                 });
             }
         })
 */
export default class CAChessApi extends ChessAPI {
    getMove(fen: string, depth: number): Promise<{ from: string; to: string; move: string; }|string> {
        return new Promise((resolve, reject) => {
            fetch("https://chess-api.com/v1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fen,
                    depth
                }),
            }).then((res) => res.json()).then((data) => {
                if(data.move) {
                    resolve(data);
                } else {
                    console.log("Stockfish error (didn't play)", data);
                    resolve("Stockfish error (didn't play)");
                }
            }).catch((err) => {
                console.log("Error fetching from Stockfish API", err);
                resolve(err.message);
            });
        });
    }
}