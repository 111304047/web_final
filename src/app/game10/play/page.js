import React from "react";
import Game10Canvas from "../../components/game10.js";

export default function App() {
  return (
    <div
      style={{
        height: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 120,
        marginBottom: 140,
        border: '3px solid #C5AC6B',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        position: 'relative',
      }}
    >
      <Game10Canvas />
    </div>
  );
}