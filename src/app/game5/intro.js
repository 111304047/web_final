"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Game5Intro() {
  const router = useRouter();
  return (
    <div
      style={{
        height: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 120,
        marginBottom: 140,
        border: '3px solid #C5AC6B',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
        background: 'transparent',
      }}
    >
      <img
        src="/gameintro.png"
        alt="遊戲說明橫幅"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: 160,
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />
      <div style={{
        padding: 32,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 90,
      }}>
        {/* 響應式列點區塊，行數多時自動縮小字體 */}
        {(() => {
          const items = [
            "想像你是一個熱門的章魚燒攤主，你的任務是在 60 秒內，做出 50 顆以上好吃的章魚燒！",
            "點擊章魚燒模具，就能倒入麵糊開始製作。待章魚燒完成，記得及時起鍋，收下一顆香噴噴的好吃章魚燒，不然很快就會變成燒焦的失敗品。",
            "每過 5 秒，遊戲難度就會自動提高，章魚燒的熟成時間也會越來越短，注意控制好節奏！",
          ];
          const fontSize = items.length >= 4 ? "clamp(14px, 2vw, 17px)" : "clamp(16px, 2.5vw, 20px)";
          return (
            <ol
              style={{
                fontSize,
                color: "#505166",
                marginBottom: 10,
                textAlign: "left",
                lineHeight: 1.8,
                fontWeight: 700,
                padding: "0 8vw",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "auto",
                maxWidth: 1000,
                margin: "0 auto",
              }}
            >
              {items.map((text, idx) => (
                <li key={idx} style={{ textAlign: 'left', width: '100%' }}>{text}</li>
              ))}
            </ol>
          );
        })()}
      </div>
      {/* 下方長條區域，永遠浮在最下方 */}
      <div
        style={{
          width: '100%',
          background: '#505166',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 80,
          position: 'absolute',
          left: 0,
          bottom: 0,
          zIndex: 2,
        }}
      >
        <button
          onClick={() => router.push("/game5/play")}
          style={{
            padding: "14px 36px",
            fontSize: 20,
            background: "#E36B5B",
            color: "#F6F7F9",
            border: "none",
            borderRadius: 50,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            letterSpacing: 2,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          開始遊戲
        </button>
      </div>
    </div>
  );
}
