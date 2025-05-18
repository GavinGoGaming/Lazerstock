import ChessAPI from "./API";

// stockfish.online docs:
/*
Endpoint: 
https://stockfish.online/api/s/v2.php

HTTP Method: 
GET

Parameter 
fen
: FEN string to analyze

Parameter 
depth
: Depth for engine to go to (int<16)

Receiving a Response
Format: 
JSON

Value 
success
: Either 
true
 or 
false
 depending on if the request completed successfully or not. If false, the value 
data
 will have error information.

Conditional on success:
Value 
bestmove
: Contains the best move in the given position. Example: 
bestmove b1c3 ponder h7h6

Value 
eval
: Either contains the standard evaluation of the given position, or 
null
 if there is a forced checkmate.

Value 
mate
: Is 
null
 unless there is a forced checkmate in the given position, in which case it is the number of moves in which the forced checkmate is completed in (positive when white is checkmating, negative for when black is checkmating).

Value 
continuation
: Top engine line in the position.
Example: 
b1c3 h7h6 c3e2 c7c6 h2h3

---
Example response:
{"success":true,
    "evaluation":1.36,
    "mate":null,
    "bestmove":"bestmove b7b6 ponder f3e5",
    "continuation":"b7b6 f3e5 h7h6 g5f6 f8f6 d2f3"}
            

*/

export default class CAStockfishOnline extends ChessAPI {
    getMove(fen: string, depth: number): Promise<{ from: string; to: string; move: string }|string> {
        // squish depth between 1-16
        if (depth < 1) depth = 1;
        if (depth > 16) depth = 16;
        return new Promise((resolve, reject) => {
            fetch(`https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${depth}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json()).then((data) => {
                if (data.success) {
                    const move = data.bestmove.split(" ")[1];
                    const from = move.substring(0, 2);
                    const to = move.substring(2, 4);
                    resolve({ from, to, move });
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