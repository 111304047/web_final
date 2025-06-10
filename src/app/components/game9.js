"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import Game9Content from "./game9Content";

export default function Game9Canvas() {
  const [status, setStatus] = useState(null); // null, "success", "fail"
  const { user, login } = useAuth();
  const [isGameActive, setIsGameActive] = useState(true); // 進入頁面直接啟動遊戲
  const statusRef = useRef(status);  // 使用 useRef 存儲狀態，避免重新渲染
  const setStatusRef = useRef(setStatus); // 用於存儲 setStatus 函數，避免直接更新
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [playAgainCount, setPlayAgainCount] = useState(0);
  const [showGambleWarning, setShowGambleWarning] = useState(false);
  const [playCount, setPlayCount] = useState(user?.playCount || 0); // 新增

  useEffect(() => {
    const hasCleared = localStorage.getItem("game2Success") === "true";
    if (hasCleared) {
      setStatus(null); // 不自動顯示視窗
    }
  }, []);

  useEffect(() => {
    if (user?.playCount !== undefined) setPlayCount(user.playCount);
  }, [user]);

  async function handleSuccess() {
    localStorage.setItem("game2Success", "true");
    statusRef.current = "success";
    setStatusRef.current("success");
    if (user?.username) {
      const newScore = (user.score || 0) + 10;
      try {
        const res = await fetch("/api/auth", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username, score: newScore }),
        });
        if (res.ok) login({ ...user, score: newScore });
        else console.error("Failed to update score");
      } catch (err) {
        console.error("Error updating score:", err);
      }
    }
  }

  async function handleFail() {
    setTimeout(async () => {
      statusRef.current = "fail";
      setStatusRef.current("fail");
      if (user?.username) {
        const newScore = (user.score || 0) - 5;
        try {
          const res = await fetch("/api/auth", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.username, score: newScore }),
          });
          if (res.ok) login({ ...user, score: newScore });
          else console.error("Failed to update score");
        } catch (err) {
          console.error("Error updating score:", err);
        }
      }
    }, 0);
  }

  return (
    <>
      <Game9Content
        onSuccess={handleSuccess}
        onFail={handleFail}
        isGameActive={isGameActive} // 傳遞遊戲是否啟動的狀態
      />

      {status && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "350px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1.5rem",
              border: "3px solid #C5AC6B",
              color: "#C5AC6B",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
            }}
          >
            <h2
              style={{
                color: "#505166",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              {status === "success" ? "中獎！" : "未中獎!"}
            </h2>
            <div style={{ display: "flex", gap: 16 }}>
              <button
                onClick={async () => {
                  if ((user?.score ?? 0) < 5) {
                    setShowScorePopup(true);
                  } else {
                    const newCount = playCount + 1;
                    setPlayCount(newCount);
                    if (user?.username) {
                      try {
                        const res = await fetch("/api/auth", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ username: user.username, score: user.score, playCount: newCount }),
                        });
                        if (res.ok) login({ ...user, playCount: newCount });
                      } catch (err) { console.error(err); }
                    }
                    if (newCount % 3 === 0) {
                      setShowGambleWarning(true);
                    } else {
                      setTimeout(() => {
                        window.location.reload();
                      }, 0);
                    }
                  }
                }}
                style={{
                  padding: "8px 24px",
                  color: "#fff",
                  background: "#E36B5B",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                再玩一次
              </button>
              <button
                onClick={() => {
                  window.location.href = "/menu";
                }}
                style={{
                  padding: "8px 24px",
                  color: "#fff",
                  background: "#505166",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                回到選單
              </button>
            </div>
          </div>
        </div>
      )}

      {showScorePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "350px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1.5rem",
              border: "3px solid #C5AC6B",
              color: "#C5AC6B",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
            }}
          >
            <h2
              style={{
                color: "#505166",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              分數不足，請獲得更多分數再來！
            </h2>
            <button
              onClick={() => {
                setShowScorePopup(false);
                window.location.href = "/menu";
              }}
              style={{
                padding: "8px 24px",
                color: "#fff",
                background: "#505166",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              回到選單
            </button>
          </div>
        </div>
      )}

      {showGambleWarning && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "350px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1.5rem",
              border: "3px solid #C5AC6B",
              color: "#C5AC6B",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
            }}
          >
            <h2
              style={{
                color: "#505166",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              小賭怡情，大賭傷身
            </h2>
            <button
              onClick={() => setShowGambleWarning(false)}
              style={{
                padding: "8px 24px",
                color: "#fff",
                background: "#505166",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
}
