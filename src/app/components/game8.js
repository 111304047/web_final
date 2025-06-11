"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";

import Order from "./game8/order.js";
import Timer from "./game8/timer.js";
import Coin from "./game8/coin.js";
import Ice from "./game8/ice.js";
import Flytopping from "./game8/flytopping.js";
import Wall from "./game8/wall.js";

export default function Game8Canvas() {
  const toppings = [
    { name: "red", top: "43.3%", left: "50.6%", scale: "18%", zIndex: 5 },
    { name: "yellow", top: "43.3%", left: "50.6%", scale: "18%", zIndex: 5 },
    { name: "green", top: "43.3%", left: "50.6%", scale: "18%", zIndex: 5 },
    { name: "blue", top: "43.3%", left: "50.6%", scale: "18%", zIndex: 5 },
    { name: "chocolate", top: "47%", left: "50%", scale: "18%", zIndex: 6 },
    { name: "strawberry", top: "55%", left: "50%", scale: "25%", zIndex: 7 },
    { name: "watermelon", top: "55%", left: "50%", scale: "25%", zIndex: 7 },
    { name: "pudding", top: "39%", left: "50%", scale: "8%", zIndex: 7 },
    { name: "cherry", top: "37%", left: "50%", scale: "7%", zIndex: 7 },
    { name: "takoyaki", top: "37.5%", left: "50%", scale: "14%", zIndex: 7 },
    { name: "fishcake", top: "37%", left: "50%", scale: "14%", zIndex: 7 },
    { name: "shrimp", top: "52%", left: "50.5%", scale: "26.5%", zIndex: 7 },
    { name: "fishplate", top: "54.5%", left: "50%", scale: "26%", zIndex: 7 },
  ];

  const entryDirections = ["left", "right", "top", "bottom"];

  const [order, setOrder] = useState([]);
  const [ice, setIce] = useState([]);
  const [coin, setCoin] = useState(0);
  const [timeKey, setTimeKey] = useState(10);
  const coinRef = useRef(coin);

  const [moveWall, setMoveWall] = useState("top");
  const [flytopping, setFlytopping] = useState(null);
  const [flyNum, setFlyNum] = useState(0);
  const [show, setShow] = useState(false);
  const [flyDir, setFlyDir] = useState("top");

  const [success, setSuccess] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    const hasCleared = localStorage.getItem("game2Success") === "true";
    if (hasCleared) {
      setSuccess(false);
      setShowOverlay(false);
    }
    setShow(true);
  }, []);

  // 產生訂單
  useEffect(() => {
    setOrder(generateOrder());
  }, []);

  // 飛入配料
  useEffect(() => {
    if (show) {
      if (flyNum % 3 == 0) {
        setFlytopping(order[(flyNum / 3) % 3]);
      }
      else {
        const index = Math.floor(Math.random() * toppings.length);
        const selectedTopping = toppings[index];
        setFlytopping(selectedTopping);
      }
    }
    setFlyNum(prev => prev + 1);
    console.log("Fly updated:", show);
  }, [show]);

  // // 檢查碰撞
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (show && flyDir == moveWall) {
  //       console.log("trigger");
  //       setShow(false);
  //       setTimeout(() => setShow(true), 500);
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    coinRef.current = coin;
  }, [coin]);

  //飛入方向
  useEffect(() => {
    setFlyDir(flydirection());
  }, [show]);

  // 偵測鍵盤事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "W":
        case "w":
          setMoveWall("top");
          break;
        case "ArrowDown":
        case "S":
        case "s":
          setMoveWall("bottom");
          break;
        case "ArrowLeft":
        case "A":
        case "a":
          setMoveWall("left");
          break;
        case "ArrowRight":
        case "D":
        case "d":
          setMoveWall("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // update order
  function generateOrder() {
    const toppings1 = Math.floor(Math.random() * 4); //syrup
    const toppings2 = Math.floor(Math.random() * 3) + 4; //bottom
    const toppings3 = Math.floor(Math.random() * 2) + 7; //top

    return [toppings[toppings1], toppings[toppings2], toppings[toppings3]];
  }

  // fly direction
  function flydirection() {
    return entryDirections[Math.floor(Math.random() * entryDirections.length)];
  }

  // update ice toppings
  function updateIce() {
    if (flyDir == moveWall)
      return;

    if (ice.length == 0) {
      setIce([flytopping]);
      return;
    }

    let updated = false;
    const newIce = ice.map((e) => {
      const i = toppings.findIndex((o) => o.name === e.name);
      const ti = toppings.findIndex((o) => o.name === flytopping.name);

      if (
        (i < 4 && ti < 4) ||
        (i >= 7 && i <= 10 && ti >= 7 && ti <= 10) ||
        ((i === 5 || i === 12) && (ti === 5 || ti === 12)) ||
        ((i === 6 || i === 11) && (ti === 6 || ti === 11))
      ) {
        updated = true;
        return flytopping;
      }

      return e;
    });

    if (!updated) {
      newIce.push(flytopping);
    }
    setIce(newIce);
    console.log("Ice updated:", newIce);
  }

  // count coin
  function chekeIce() {
    let delta = 0;
    ice.forEach(e => {
      if (order.find((o) => o.name === e.name)) {
        delta += 30;
      }
      else if (toppings.findIndex(o => o.name == e.name) > 8) {
        delta -= 20;
      }
      else {
        delta -= 5;
      }
    });

    setCoin(prev => prev + delta);

  }

  // 當成功或失敗時呼叫此函式
  async function handleSuccess() {
    localStorage.setItem("game2Success", "true");
    //setSuccess(true);

    if (coinRef.current >= 300) {
      setSuccess(true);
    }
    else {
      setSuccess(false);
    }

    setShowOverlay(true);
    // SCORE +1 並同步到 DB
    if (user && user.username && success) {
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
          position: "relative",
        }}>

        <Ice components={ice} />

        {/*wall*/}
        <Wall direction={moveWall} />

        {/* fly topping*/}
        {show && flytopping && (
          <Flytopping
            topping={flytopping}
            direction={flyDir}
            onArrive={() => {
              setShow(false);
              updateIce();
              setFlytopping(null);

              setTimeout(() => {
                setShow(true);
              }, 500);
            }} />
        )}

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

          <Timer key={timeKey} duration={100} onEnd={() => {
            setTimeout(() => {
              handleSuccess();
              setShow(false);
            }, 100)

          }}></Timer>

        </div>

        {/* serve*/}
        <button
          onClick={
            () => {
              setShow(false);
              chekeIce();
              setIce([]);
              setOrder(generateOrder());

              setTimeout(() => {
                setShow(true);
              }, 500); //new round
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
            {success ? (
              <h2 style={{ color: "#505166", fontSize: 22, fontWeight: 700, marginBottom: 18, textAlign: "center" }}>
                挑戰成功！
              </h2>
            ) : (
              <h2 style={{ color: "#505166", fontSize: 22, fontWeight: 700, marginBottom: 18, textAlign: "center" }}>
                挑戰失敗＞＜
              </h2>
            )}

            <div style={{ display: "flex", gap: 16 }}>
              <button
                onClick={() => {
                  // 重置遊戲狀態
                  setShowOverlay(false);
                  setSuccess(false);
                  localStorage.removeItem("game2Success");

                  setIce([]);
                  setCoin(0);
                  setTimeKey(prev => prev += 1);
                  setFlytopping(null);
                  setFlyNum(0);
                  setShow(true);
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
    </>
  );
} 