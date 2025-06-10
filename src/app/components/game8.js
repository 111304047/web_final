"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

import Order from "./game8/order.js";
import Timer from "./game8/timer.js";
import Coin from "./game8/coin.js";
import Ice from "./game8/ice.js";

export default function Game8Canvas() {
  const toppings = [
    {name: "red", top: "39%", left: "51%", scale: "27.5%", zIndex: 1},
    {name: "yellow", top: "39%", left: "51%", scale: "27.5%", zIndex: 1},
    {name: "green", top: "39%", left: "51%", scale: "27.5%", zIndex: 1},
    {name: "blue", top: "39%", left: "51%", scale: "27.5%", zIndex: 1},
    {name: "chocolate", top: "45%", left: "51%", scale: "27.5%", zIndex: 2},
    {name: "strawberry", top: "57.5%", left: "50%", scale: "40%", zIndex: 3},
    {name: "watermelon", top: "57.5%", left: "50%", scale: "40%", zIndex: 3},
    {name: "pudding", top: "32%", left: "50%", scale: "12%", zIndex: 3},
    {name: "cherry", top: "30%", left: "50%", scale: "12%", zIndex: 3},
    {name: "takoyaki", top: "32%", left: "50%", scale: "20%", zIndex: 3},
    {name: "fishcake", top: "32%", left: "51%", scale: "17%", zIndex: 3},
    {name: "shrimp", top: "54.5%", left: "50.5%", scale: "40%", zIndex: 3},
    {name: "fishplate", top: "57.5%", left: "50%", scale: "40%", zIndex: 3},
  ]

  const [order, setOrder] = useState([]);
  const [ice, setIce] = useState([]);
  const [coin, setCoin] = useState(0);

  const [success, setSuccess] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    setOrder(generateOrder());
  }, []);

  useEffect(() => {
    const hasCleared = localStorage.getItem("game2Success") === "true";
    if (hasCleared) {
      setSuccess(false);
      setShowOverlay(false);
    }
  }, []);

  // update order
  function generateOrder() {
    const toppings1 = Math.floor(Math.random() * 4); //syrup
    const toppings2 = Math.floor(Math.random() * 3) + 4; //bottom
    const toppings3 = Math.floor(Math.random() * 2) + 7; //top

    return [toppings[toppings1], toppings[toppings2], toppings[toppings3]];
  }

  // 當過關時呼叫此函式
  async function handleSuccess() {
    localStorage.setItem("game2Success", "true");
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

  return (
    <>
      {/* 這裡放你的遊戲元件或互動內容，預設只留一個模擬過關按鈕 */}
      {/* <button
        onClick={handleSuccess}
        style={{
          padding: "12px 32px",
          fontSize: 20,
          borderRadius: 8,
          background: "#C5AC6B",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        模擬過關8（請改成你自己的過關條件）
      </button> */}

      {/* order list*/}
      <div
        style={{
          background: "#C5AC6B",
          borderRadius: 12,
          height: "100%",
          width: "100%",
          maxWidth: "200px",
          margin: "10px",
          padding: "15px",
          boxSizing: "border-box",
        }}>

        <Order orders={order} />

      </div>

      {/* ice*/}
      <div
        style={{
          background: "#505166",
          borderRadius: 12,
          height: "100%",
          width: "100%",
          minWidth: "250px",
          maxWidth: "500px",
          margin: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>

        <Ice components={ice} />
      </div>

      {/* right-bottom*/}
      <div
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "300px",
          margin: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>

        {/* time*/}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            flex: 1,
          }}>

          <Timer duration={100} onEnd={() => {
            // 時間結束時的處理
          }}></Timer>

        </div>

        {/* serve*/}
        <button
          onClick={
            () => {
              setOrder(generateOrder());
            }
          }
          style={{
            background: "#E36B5B",
            borderRadius: 12,
            flex: 1,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "clamp(1rem, 4vw, 2rem)",
            fontWeight: "bold",
            letterSpacing: 10,
            border: "none",
            color: "white"
          }}
        >
          出餐
        </button>

        {/* coin */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            flex: 1
          }}>

          <Coin coins={coin} />
        </div>

      </div>

      {/* 成功過關後彈窗 */}
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
                  // 重置遊戲狀態
                  setShowOverlay(false);
                  setSuccess(false);
                  localStorage.removeItem("game2Success");
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
    </>
  );
} 