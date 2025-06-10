"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Game8Intro() {
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
            "作為刨冰屋的老闆，任務是依據左方的訂單，做出客人想吃的刨冰。",
            "畫面中會不斷有食材飛向中央的刨冰，按方向鍵控制光束擊落錯誤的食材。",
            "完成刨冰後點擊出餐，獲得收益。盡量在時間內做出更多的刨冰吧！",
            "小心有奇怪的配料混進來！",
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
          onClick={() => router.push("/game8/play")}
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
