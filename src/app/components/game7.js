"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext";

const MAX_SHOTS = 5;
const PRIZES = [
  { x: 160, y: 95, r: 28 }, { x: 240, y: 95, r: 28 },
  { x: 120, y: 165, r: 28 }, { x: 200, y: 165, r: 28 }, { x: 280, y: 165, r: 28 },
  { x: 80, y: 243, r: 28 }, { x: 140, y: 243, r: 28 }, { x: 200, y: 243, r: 28 }, { x: 260, y: 243, r: 28 }, { x: 320, y: 243, r: 28 },
];

export default function Game7Canvas() {
  // stage: "intro" - 遊戲說明, "round" - 每回合開始, "playing" - 遊戲進行中, "result" - 結算
  const [stage, setStage] = useState("intro"); // 遊戲狀態

  // 射擊次數、分數、命中獎品列表
  const [shotsLeft, setShotsLeft] = useState(MAX_SHOTS);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState([]); 

  // QTE 狀態
  const [qteStep, setQteStep] = useState(0); // 0:等待, 1:水平, 2:垂直, 3:判定
  const [qteX, setQteX] = useState(0); // 垂直 QTE
  const [qteY, setQteY] = useState(0); // 水平 QTE
  const [qteVX, setQteVX] = useState(1);
  const [qteVY, setQteVY] = useState(1);

  // 當前回合、彈窗狀態、結果提示
  const [currentRound, setCurrentRound] = useState(1);
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [showResultTip, setShowResultTip] = useState(""); // "hit" or "miss" or ""
  const canvasRef = useRef(null);
  const { user, login } = useAuth();
  const prizeImagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const shootBgImg = useRef(null);

  // 載入獎品圖片
  useEffect(() => {
    let loaded = 0;
    const imgs = Array.from({ length: 10 }, (_, i) => {
      const num = String(i + 1).padStart(3, "0");
      const img = new window.Image();
      img.src = `/game7/prize-${num}.png`;
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded === 10) setImagesLoaded(true);
      };
      return img;
    });
    prizeImagesRef.current = imgs;
  }, []);

  // 載入遊戲背景圖片
  useEffect(() => {
    // 載入shootBg.png
    const bg = new window.Image();
    bg.src = "/game7/shootBg.png";
    shootBgImg.current = bg;
  }, []);

  // 遊戲畫面
  useEffect(() => {
    if (stage !== "playing") return;
    let req;
    function animate() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 400, 300);

      // 畫背景
      const bg = shootBgImg.current;
      if (bg && bg.complete) {
        ctx.drawImage(bg, 0, 0, 400, 400);
      }

      // 畫獎品
      PRIZES.forEach((p, idx) => {
        const img = prizeImagesRef.current[idx];
        if (img && img.complete) {
          // 若已命中則灰階顯示
          if (hits.includes(idx)) {
            ctx.save();
            ctx.filter = "grayscale(1)";
            ctx.drawImage(img, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            ctx.restore();
          } else {
            ctx.drawImage(img, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
          }
        } else {
          // 若圖片未載入則畫圓形
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
          ctx.fillStyle = hits.includes(idx) ? "#aaa" : "#C5AC6B";
          ctx.fill();
          ctx.strokeStyle = "#505166";
          ctx.stroke();
        }
      });

      // 畫 QTE
      if (qteStep === 1) {
        ctx.strokeStyle = "#E36B5B";
        ctx.beginPath();
        ctx.moveTo(0, qteY);
        ctx.lineTo(400, qteY);
        ctx.stroke();
      }
      if (qteStep === 2) {
        // 水平
        ctx.strokeStyle = "#E36B5B";
        ctx.beginPath();
        ctx.moveTo(qteX, 0);
        ctx.lineTo(qteX, 300);
        ctx.stroke();
        // 垂直
        ctx.strokeStyle = "#E3B95B";
        ctx.beginPath();
        ctx.moveTo(0, qteY);
        ctx.lineTo(400, qteY);
        ctx.stroke();
      }

      // 命中點
      if (qteStep === 3) {
        ctx.fillStyle = "#E36B5B";
        ctx.beginPath();
        ctx.arc(qteX, qteY, 8, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // QTE 移動
    function moveQTE() {
      if (qteStep === 1) {
        setQteY(y => {
          let ny = y + qteVY;
          let newVY = qteVY;
          if (ny < 20 || ny > 280) {
            newVY = -qteVY;
            ny = Math.max(20, Math.min(280, ny));
          }
          setQteVY(newVY);
          return ny;
        });
      }
      if (qteStep === 2) {
        setQteX(x => {
          let nx = x + qteVX;
          let newVX = qteVX;
          if (nx < 20 || nx > 380) {
            newVX = -qteVX;
            nx = Math.max(20, Math.min(380, nx));
          }
          setQteVX(newVX);
          return nx;
        });
      }
    }

    animate();
    if (qteStep === 1 || qteStep === 2) {
      req = requestAnimationFrame(() => {
        moveQTE();
        animate();
      });
    }
    return () => req && cancelAnimationFrame(req);
  }, [qteStep, qteX, qteY, qteVX, qteVY, hits, stage]);

  // 開始遊戲
  const startGame = () => {
    setStage("round");
    setShotsLeft(MAX_SHOTS);
    setScore(0);
    setHits([]);
    setCurrentRound(1);
    setShowRoundModal(true);
    setQteStep(0);
  };

  // 射擊開始
  const startRound = () => {
    setShowRoundModal(false);
    setQteStep(1);
    setQteY(50 + Math.random() * 200);
    setQteX(50 + Math.random() * 300);
    setQteVX(0.7 + Math.random());
    setQteVY(0.7 + Math.random());
    setStage("playing");
  };

  // QTE
  const handleKeyDown = useCallback((e) => {
    if (stage !== "playing" || shotsLeft <= 0) return;
    if (e.code !== "Space") return;
    if (qteStep === 1) {
      setQteStep(2);
      setQteVX(0.7 + Math.random());
      setQteX(50 + Math.random() * 300);
    } else if (qteStep === 2) {
      setQteStep(3);
      // 判斷命中
      let hitIdx = PRIZES.findIndex(p => {
        const dx = p.x - qteX;
        const dy = p.y - qteY;
        return Math.sqrt(dx * dx + dy * dy) <= p.r;
      });

      // 1 秒後顯示命中 / 殘念
      setTimeout(() => {
        if (hitIdx !== -1 && !hits.includes(hitIdx)) {
          setHits(hs => [...hs, hitIdx]);
          setScore(s => s + 100);
          setShowResultTip("hit");
        } else {
          setShowResultTip("miss");
        }
        // 1.5 秒後進入下一回合(彈窗)
        setTimeout(() => {
          setShotsLeft(n => n - 1);
          setQteStep(0);
          setStage("round");
          setCurrentRound(r => r + 1);
          setShowResultTip("");
          // 若已射完五次，則進入結算
          if (shotsLeft - 1 <= 0) {
            setStage("result");
          } else {
            setShowRoundModal(true);
          }
        }, 1500);
      }, 1000);
    }
  }, [stage, shotsLeft, qteStep, qteX, qteY, hits]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 結算
  useEffect(() => {
    async function handleSuccess() {
      localStorage.setItem("game7Success", "true");
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
          }
        } catch (err) {
          console.error("Error updating score:", err);
        }
      }
    }
    if (stage === "result") {
      const grade = getGrade(score);
      if (grade === "A" || grade === "S") {
        handleSuccess();
      }
    }
  }, [stage, score, user, login]);

  // 再玩一次
  const resetGame = () => {
    setStage("intro");
    setScore(0);
    setHits([]);
    setShotsLeft(MAX_SHOTS);
    setCurrentRound(1);
    setQteStep(0);
    setShowRoundModal(false);
    setShowResultTip("");
    localStorage.removeItem("game7Success");
  };

  // 載入中
  if (!imagesLoaded) {
    return (
      <div style={{textAlign: "center", padding: 48, fontSize: 24}}>
        載入中...
      </div>
    );
  }

  return (
    <>
      {/* 遊戲說明 */}
      {stage === "intro" && (
        <div style={{ textAlign: "center", padding: 32 }}>
          <h2>百發百中</h2>
          <ol style={{
            textAlign: "left",  // 文字靠左
            maxWidth: 400,
            margin: "0 auto",  // 整區塊置中
            display: "block",
            padding: 0,
            listStylePosition: "inside"
          }}>
            <li>遊戲說明遊戲說明</li>
            <li>遊戲說明遊戲說明</li>
          </ol>
          <button
            onClick={startGame}
            style={{
              marginTop: 24,
              padding: "12px 32px",
              fontSize: 20,
              borderRadius: 8,
              background: "#C5AC6B",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            開始遊戲
          </button>
        </div>
      )}

      {/* 每回合開始彈窗 */}
      {showRoundModal && stage !== "result" && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.25)",
          zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 32, minWidth: 260, textAlign: "center",
            boxShadow: "0 4px 32px rgba(0,0,0,0.18)"
          }}>
            <h2>第 {Math.min(currentRound, MAX_SHOTS)} 回射擊</h2>
            <button
              onClick={startRound}
              style={{
                marginTop: 24,
                padding: "12px 32px",
                fontSize: 20,
                borderRadius: 8,
                background: "#C5AC6B",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              開始
            </button>
          </div>
        </div>
      )}

      {/* 命中/未命中提示 */}
      {showResultTip && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.15)",
          zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 32, minWidth: 200, textAlign: "center",
            boxShadow: "0 4px 32px rgba(0,0,0,0.18)", fontSize: 28, color: showResultTip === "hit" ? "#E36B5B" : "#505166"
          }}>
            {showResultTip === "hit"
              ? <>🎯命中！<br />+100</>
              : <>🌀殘念<br />+0</>
            }
          </div>
        </div>
      )}

      {/* 遊戲進行 */}
      {stage === "playing" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 8 }}>
            射擊次數：{shotsLeft}　分數：{score}
          </div>
          <canvas
            ref={canvasRef}
            width={400}
            height={400} // 高度由300改為400
            style={{ border: "2px solid #ccc", background: "#fff" }}
          />
          <div style={{ marginTop: 8, color: "#888" }}>
            {qteStep === 1 && "按 SPACE 鎖定水平線"}
            {qteStep === 2 && "按 SPACE 鎖定垂直線"}
            {qteStep === 3 && "判定中..."}
          </div>
        </div>
      )}

      {/* 結算畫面 */}
      {stage === "result" && (
        <div style={{
          textAlign: "center",
          padding: 32,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
          maxWidth: 400,
          margin: "40px auto"
        }}>
          <h2>遊戲結束</h2>
          <div>得分：{score}</div>
          <div>評價：{getGrade(score)}</div>
          <div style={{ margin: "16px 0" }}>
            {getGrade(score) === "A" || getGrade(score) === "S"
              ? <span style={{ color: "#C5AC6B" }}>恭喜通關！</span>
              : <span style={{ color: "#E36B5B" }}>未達A級，再接再厲！</span>
            }
          </div>
          <button
            onClick={resetGame}
            style={{
              padding: "8px 24px",
              color: "#fff",
              background: "#E36B5B",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              marginRight: 12,
            }}
          >
            再玩一次
          </button>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              padding: "8px 24px",
              color: "#fff",
              background: "#505166",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            返回主頁
          </button>
        </div>
      )}
    </>
  );
}

// 評級
function getGrade(score) {
  if (score >= 500) return "S";
  if (score >= 400) return "A";
  if (score >= 300) return "B";
  return "C";
}