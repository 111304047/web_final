"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";

export default function Game11Canvas() {
  // 狀態宣告與用途說明
  const [success, setSuccess] = useState(false); // 是否成功過關
  const [failed, setFailed] = useState(false); // 是否失敗
  const [showOverlay, setShowOverlay] = useState(false); // 是否顯示彈窗
  const [countdown, setCountdown] = useState(3); // 倒數計時秒數
  const [showStart, setShowStart] = useState(false); // 是否顯示 Start 文字
  const [progress, setProgress] = useState(100); // 進度條百分比
  const [isReadyToHit, setIsReadyToHit] = useState(false); // 是否準備好點擊
  const lastHitTimeRef = useRef(0);
  const { user, login } = useAuth();
  const brick1Ref = useRef(null);
  const progressIntervalRef = useRef(null);

  // 初始化檢查是否已過關，若是則不顯示彈窗
  useEffect(() => {
    const hasCleared = localStorage.getItem("game11Success") === "true";
    if (hasCleared) {
      setSuccess(false); 
      setShowOverlay(false);
    }
  }, []);

  // 倒數計時效果，從 countdown 3 開始遞減，倒數結束時顯示 Start 文字
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowStart(true);
      const timer = setTimeout(() => {
        setShowStart(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 啟動進度條倒數，倒數到 0 時停止
  useEffect(() => {
    if (countdown === 0 && !showStart) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressIntervalRef.current);
            return 0;
          }
          return prev - 2;
        });
      }, 20);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [countdown, showStart]);

  // 監控進度條歸零，0.5 秒內未點擊則判定失敗並顯示彈窗
  useEffect(() => {
    if (progress === 0 && !success && !failed) {
      lastHitTimeRef.current = Date.now(); // 紀錄進度條歸零的時間
      const timer = setTimeout(() => {
        if (!success) {
          setFailed(true);
          setShowOverlay(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [progress, success, failed]);

  // handleHit 函式從 useEffect 中提取出來，作為元件內部的獨立函式
  function handleHit() {
    if (showStart || countdown > 0) return;
    const now = Date.now();
    if (!success && !failed) {
      if (progress > 0) {
        setFailed(true);
        setShowOverlay(true);
        clearInterval(progressIntervalRef.current);
        return;
      } else {
        const delta = now - lastHitTimeRef.current;
        if (delta <= 250) {
          handleSuccess();
        } else if (delta <= 1500) {
          // 有動畫的失敗（磚塊左移，塔向右倒）
          setFailed(true);
          setIsReadyToHit(false);
          setTimeout(() => {
            setShowOverlay(true);
          }, 600);
        } else {
          // 超過 1.5 秒未點擊，無動畫失敗
          setFailed(true);
          setShowOverlay(true);
        }
      }
    }
  }

  // 監聽鍵盤空白鍵與點擊事件，處理點擊行為判斷
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code === "Space") {
        e.preventDefault();
        handleHit();
      }
    }
    function onClick(e) {
      if (brick1Ref.current && brick1Ref.current.contains(e.target)) {
        handleHit();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
    };
  }, [progress, success, failed, showStart, countdown]);

  // 過關行為與分數更新流程
  // 1. 設定 localStorage 過關標記
  // 2. 更新成功狀態與取消準備點擊狀態
  // 3. 若使用者登入，將分數 +1 並同步更新到後端資料庫
  async function handleSuccess() {
    localStorage.setItem("game11Success", "true");
    setSuccess(true);
    setIsReadyToHit(false);
    // setShowOverlay(true); // 延後顯示彈窗，移除這一行
    // SCORE +1 並同步到 DB
    if (user && user.username) {
      const newScore = (user.score || 0) + 1;
      try {
        const res = await fetch("/api/auth", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username, score: newScore }),
        });
        if (res.ok) {
          login({ ...user, score: newScore });
        } else {
          console.error("Failed to update score");
        }
      } catch (err) {
        console.error("Error updating score:", err);
      }
    }
  }

  // 成功後延遲 600ms 顯示彈窗，確保動畫完成
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 600); // 確保動畫結束後再顯示
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#222222', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 倒數遮罩 */}
      {(countdown > 0 || (countdown === 0 && showStart)) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          zIndex: 998,
        }} />
      )}
      {/* 倒數數字 */}
      {countdown > 0 && (
        <div
          key={countdown}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 160,
            height: 160,
            borderRadius: '50%',
            backgroundColor: '#E36B5B',
            border: '8px solid #F5F0E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            // animation 僅套用於容器，不與 transform 衝突
            animation: 'scaleUp 0.5s cubic-bezier(0.7,0.2,0.2,1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: 96,
              fontWeight: 'bold',
              color: '#F5F0E4',
            }}
          >
            {countdown}
          </div>
        </div>
      )}

      {/* Start 文字顯示 */}
      {countdown === 0 && showStart && (
        <div className="strokeText" data-stroke="Start!" id="start-text">
          Start!
        </div>
      )}

      {/* 背景燈籠 */}
      <img 
        src="/lantern.png" alt="lantern" 
        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '25%', objectFit: 'cover', zIndex: 0}}
      />
      
      {/* 中央區域：達摩塔與棍棒 */}
      <div style={{ flexGrow: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 10, zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              transition: 'transform 0.25s ease',
              transform:
                success
                  ? 'translateY(10vh)'
                  : failed && progress <= 0 && Date.now() - lastHitTimeRef.current <= 1500
                  ? 'rotate(35deg) translateY(85px)'
                  : 'translateY(0)',
            }}
          >
            <div><img src="/daruma.png" alt="daruma" style={{ width: '25vh', height: '17.5vh' }} /></div>
            <div><img src="/brick_4.png" alt="brick_4" style={{ width: '25vh', height: '10vh' }} /></div>
            <div><img src="/brick_3.png" alt="brick_3" style={{ width: '25vh', height: '10vh' }} /></div>
            <div><img src="/brick_2.png" alt="brick_2" style={{ width: '25vh', height: '10vh' }} /></div>
          </div>
          <div 
            ref={brick1Ref} 
            onClick={handleHit} 
            style={{ 
              width: '25vh', 
              height: '10vh', 
              transition: 'transform 0.1s ease',
              transform: (progress === 0 && success)
                ? 'translateX(-18vw)'
                : (progress === 0 && failed && Date.now() - lastHitTimeRef.current <= 1500)
                ? 'translateX(-18vw)'
                : 'translateY(0)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <img src="/brick_1.png" alt="brick_1" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
        {/* 棍棒圖像，從右側揮向達摩塔，擺在塔的下方右側，稍微傾斜 */}
        <img 
          src="/stick.png" 
          alt="stick" 
          style={{ 
            position: 'absolute', 
            right: 'calc(50% - 400px)', 
            width: '30vh', 
            height: '10vh', 
            transformOrigin: 'right center',
            userSelect: 'none',
            pointerEvents: 'none',
          }} 
        />
      </div>

      {/* 下方進度條 */}
      <div style={{ height: '2vh', backgroundColor: 'rgba(245, 240, 228, 0.9)', margin: '0 24px 16px', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ width: progress + '%', height: '100%', backgroundColor: '#E36B5B' }}></div>
      </div>

      {/* 成功或失敗後彈窗 */}
      {showOverlay && (
        <div style={{
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
        }}>
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
            <h2 style={{ color: "#505166", fontSize: 22, fontWeight: 700, marginBottom: 18, textAlign: "center" }}>
              {success ? 'Success！' : 'Failed！'}
            </h2>
            <div style={{ display: "flex", gap: 16 }}>
              <button
                onClick={() => {
                  // 重置遊戲狀態
                  setShowOverlay(false);
                  setSuccess(false);
                  setFailed(false);
                  setIsReadyToHit(false);
                  setProgress(100);
                  setCountdown(3);
                  localStorage.removeItem("game11Success");
                  // TODO: 這裡也要重置你自己的遊戲狀態
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
                Again
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
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
                Back
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 縮放動畫 CSS */}
      <style>{`
        @keyframes scaleUp {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }

        .strokeText {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 96px;
          font-weight: bold;
          color: #E36B5B;
          z-index: 999;
          animation: scaleUp 0.5s cubic-bezier(0.7,0.2,0.2,1);
        }

        .strokeText::before {
          content: attr(data-stroke);
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          color: transparent;
          -webkit-text-stroke: 10px #F5F0E4;
          text-stroke: 10px #F5F0E4;
        }
      `}</style>
    </div>
  );
}