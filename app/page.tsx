"use client";
import Image from "next/image";
import { Chess } from "chess.js";
import Chessboard from "./chess";

export default function Home() {
  const game = new Chess();
  return (
    <>
      <h1 className="klash-legacy title"><img src="/favicon.ico" /> Lazerstock</h1>
      <span>Powerful chess engine powered by Stockfish 17NNUE</span>
      <Chessboard game={game} />
    </>
  );
}
