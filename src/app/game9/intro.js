"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Game9Intro() {
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
            "歡迎來到祭典抽籤機！",
            "請以←↑→的順序按鍵盤上的方向鍵，完成一次轉動，請完成五次轉動開獎！",
            "中獎可獲得10分，未中獎則扣5分，現有分數超過5分時即可遊玩！",
            "溫馨提醒：小賭怡情，大賭傷身心",
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
          onClick={() => router.push("/game9/play")}
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
