"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../AuthContext";

export default function GestureCanvas() {
  const [path, setPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const canvasRef = useRef(null);
  const { user, login } = useAuth();

  // 只做 localStorage check，但不立即跳成功視窗
  useEffect(() => {
    const hasCleared = localStorage.getItem("summonSuccess") === "true";
    if (hasCleared) {
      setSuccess(false); // 不自動切換到成功畫面
      setShowOverlay(false);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#4B2E05"; 
    ctx.beginPath();
    path.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
  }, [path]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPath([{ x, y }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPath((prevPath) => [...prevPath, { x, y }]);
  };

  const handleMouseUp = async () => {
    setIsDrawing(false);
    const result = isStraightLine(path);
    console.log("判斷結果：", result);
    if (result) {
      localStorage.setItem("summonSuccess", "true");
      setSuccess(true);
      setShowOverlay(true);
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
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        maxHeight: "500px",
        backgroundImage: success
          ? "url(/bg-summonRun.png)"
          : "url(/bg-summon.png)",
        backgroundSize: "clamp(700px, 60%, 1000px)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* 中央畫布 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255,255,255,0.4)",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          width: "300px",
          height: "300px", // 高度改為 300px
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{
            background: "transparent",
            borderRadius: "12px",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      {/* 成功召喚後彈窗 */}
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
              Success！
            </h2>
            <div style={{ display: "flex", gap: 16 }}>
              <button
                onClick={() => {
                  setPath([]);
                  setIsDrawing(false);
                  setShowOverlay(false);
                  setSuccess(false);
                  localStorage.removeItem("summonSuccess");
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
    </div>
  );
}

// 判斷直線演算法
function isStraightLine(points) {
  if (points.length < 5) return false;
  const p0 = points[0];
  const p1 = points[points.length - 1];
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  if (lineLength < 50) return false;

  let totalDeviation = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const px = points[i].x;
    const py = points[i].y;
    const distance =
      Math.abs(dy * px - dx * py + p1.x * p0.y - p1.y * p0.x) / lineLength;
    totalDeviation += distance;
  }
  const avgDeviation = totalDeviation / points.length;
  console.log("平均偏差：", avgDeviation);
  return avgDeviation < 15;
}
