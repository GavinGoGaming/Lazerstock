export default abstract class ChessAPI {
    // will be overridden by subclass
    // we need a getMove() taking in a fen string and depth and returning a from/to/move

    abstract getMove(fen: string, depth: number): Promise<{ from: string; to: string; move: string }|string>;
}