"use client";
import React, { useState, useEffect } from "react";
import "./game5.css";

export default function Game5Canvas() {
  const [holes, setHoles] = useState(Array(8).fill({ state: "empty", timer: 0 }));
  const [timer, setTimer] = useState(60);
  const [goodScore, setGoodScore] = useState(0);
  const [badScore, setBadScore] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      if (goodScore >= 30) {
        setSuccess(true);
      }
      setShowOverlay(true);
      return;
    }
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoles((prev) =>
        prev.map((hole) => {
          if (hole.state === "raw" && hole.timer >= 5) return { state: "cooked", timer: 0 };
          if (hole.state === "cooked" && hole.timer >= 2) return { state: "burnt", timer: 0 };
          if (hole.state === "raw" || hole.state === "cooked") {
            return { ...hole, timer: hole.timer + 1 };
          }
          return hole;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (index) => {
    setHoles((prev) => {
      const hole = prev[index];
      const newHoles = [...prev];
      if (hole.state === "empty") {
        newHoles[index] = { state: "raw", timer: 0 };
      } else if (hole.state === "cooked") {
        newHoles[index] = { state: "empty", timer: 0 };
        setGoodScore((g) => g + 1);
      } else if (hole.state === "burnt") {
        newHoles[index] = { state: "empty", timer: 0 };
        setBadScore((b) => b + 1);
      }
      return newHoles;
    });
  };

  const getHoleClass = (state) => `takoyaki-hole ${state}`;

  return (
    <div className="game-wrapper">
      <div className="game-container">
        {/* Info Panel */}
        <div className="info-panel">
          <div className="timer-box">
            <img src="/images/clock.png" className="timer-img" />
            <div>{timer}s</div>
          </div>
          <div className="score-box">
            <div className="score good">
              <img src="/images/good taco.png" className="score-icon" />
              <div className="score-num">{String(goodScore).padStart(2, "0")}</div>
            </div>
            <div className="score bad">
              <img src="/images/bad taco.png" className="score-icon" />
              <div className="score-num">{String(badScore).padStart(2, "0")}</div>
            </div>
          </div>
        </div>

        {/* Grill Panel */}
        <div className="grill-panel">
          {holes.map((hole, idx) => (
            <div
              key={idx}
              className={getHoleClass(hole.state)}
              onClick={() => handleClick(idx)}
            />
          ))}
        </div>

        {/* 成功過關後彈窗 */}
        {showOverlay && (
          <div className="overlay">
            <div className="result-box">
              <img
                src={success ? "/images/win.png" : "/images/fail.png"}
                alt={success ? "挑戰成功" : "挑戰失敗"}
                className="result-icon"
              />
              <h2 className="result-title">
                {success ? "挑戰成功" : "挑戰失敗"}
              </h2>
              <div className="result-buttons">
                <button
                  className="btn btn-gold"
                  onClick={() => (window.location.href = "/")}
                >
                  回到首頁
                </button>
                <button
                  className="btn btn-red"
                  onClick={() => {
                    setHoles(Array(8).fill({ state: "empty", timer: 0 }));
                    setGoodScore(0);
                    setBadScore(0);
                    setTimer(60);
                    setShowOverlay(false);
                    setSuccess(false);
                  }}
                >
                  再玩一次
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
