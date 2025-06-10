"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import "../game4/play/Game4Canvas.css";
import ReactDOM from "react-dom";

// 圖片及尺寸常數
import ringBase from "../../../public/ringBase.png";
import ringOverlay from "../../../public/ringOverlay.png";
import ringStack from "../../../public/ringStack.png";
import item1 from "../../../public/item1.png";
import item2 from "../../../public/item2.png";
import item3 from "../../../public/item3.png";
import item4 from "../../../public/item4.png";
import item5 from "../../../public/item5.png";
import item6 from "../../../public/item6.png";
import item7 from "../../../public/item7.png";
import item8 from "../../../public/item8.png";
import item9 from "../../../public/item9.png";
import item10 from "../../../public/item10.png";
import item11 from "../../../public/item11.png";
import item12 from "../../../public/item12.png";

const IMG_SIZE = 84;
const ringColors = ["#C0AABA", "#505166", "#787999", "#B38DA9", "#8D8FB3"];
const baseConfigs = [
  { img: item1.src, value: 30, rate: 0.25 },
  { img: item2.src, value: 20, rate: 0.5 },
  { img: item3.src, value: 20, rate: 0.6 },
  { img: item4.src, value: 10, rate: 0.7 },
  { img: item5.src, value: 40, rate: 0.25 },
  { img: item6.src, value: 30, rate: 0.35 },
  { img: item7.src, value: 45, rate: 0.2 },
  { img: item8.src, value: 25, rate: 0.5 },
  { img: item9.src, value: 15, rate: 0.8 },
  { img: item10.src, value: 15, rate: 0.8 },
  { img: item11.src, value: 5, rate: 0.9 },
  { img: item12.src, value: 5, rate: 0.9 }
];
const itemConfigs = [...baseConfigs, ...baseConfigs];
const sidebarConfigs = [
  { img: item1.src, value: 30 }, { img: item2.src, value: 20 },
  { img: item3.src, value: 20 }, { img: item4.src, value: 10 },
  { img: item5.src, value: 40 }, { img: item6.src, value: 30 },
  { img: item7.src, value: 45 }, { img: item8.src, value: 25 },
  { img: item9.src, value: 15 }, { img: item10.src, value: 15 },
  { img: item11.src, value: 5 },  { img: item12.src, value: 5 }
];

class Ring {
  constructor(color) {
    this.color = color;
    this.el = null;
  }
  spawn(parent) {
    // 從 indicator 位置生成空殼
    const img = document.createElement("img");
    img.className = "ring";
    img.style.position = "absolute";
    img.style.left = "50%";
    img.style.bottom = "12px";
    img.style.top = "auto";
    img.style.width = "55px";
    img.style.height = "55px";
    img.style.transform = "translateX(-50%) scale(0)";
    parent.appendChild(img);
    this.el = img;
    // 上色
    const baseImg = new Image();
    baseImg.src = ringBase.src;
    baseImg.onload = () => {
      const cvs = document.createElement("canvas");
      cvs.width = baseImg.width;
      cvs.height = baseImg.height;
      const ctx = cvs.getContext("2d");
      ctx.drawImage(baseImg, 0, 0);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      this.el.src = cvs.toDataURL();
      // 縮放入場
      requestAnimationFrame(() => {
        this.el.style.transition = "transform 0.3s ease-out";
        this.el.style.transform = "translateX(-50%) scale(1)";
      });
    };
  }
  throwTo(targetX, targetY, cb, miss = false) {
    // 取得起點（indicator）在 container 內的座標
    const startRect = this.el.getBoundingClientRect();
    const parentRect = this.el.parentElement.getBoundingClientRect();
    const startX = startRect.left - parentRect.left + startRect.width / 2;
    const startY = startRect.top - parentRect.top + startRect.height / 2;
    // 終點為 targetX, targetY（傳入的目標中心點）
    // 計算位移
    const dx = targetX - startX;
    const dy = targetY - startY;
    // 設定動畫參數
    const duration = 600;
    const peak = -80; // 拋物線頂點高度（負值往上）
    const startTime = performance.now();
    const animate = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      // 拋物線插值：x 線性，y 為二次曲線
      const x = dx * t;
      const y = dy * t + peak * 4 * t * (1 - t);
      this.el.style.transform = `translateX(-50%) translate(${x}px, ${y}px) scale(1)`;
      if (t < 1) {
        requestAnimationFrame(animate);
      } else if (miss) {
        // 沒套中，繼續往下掉落
        this._fall(targetX, targetY, cb);
      } else {
        this.el.remove();
        cb && cb();
      }
    };
    requestAnimationFrame(animate);
  }
  _fall(x, y, cb) {
    // 從 x, y 開始往下掉落
    const duration = 700;
    const startY = y;
    const endY = y + 120;
    const startTime = performance.now();
    const animate = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const currY = startY + (endY - startY) * t;
      this.el.style.transform = `translateX(-50%) translate(${x}px, ${currY}px) scale(1)`;
      this.el.style.opacity = 1 - t;
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.el.remove();
        cb && cb();
      }
    };
    requestAnimationFrame(animate);
  }
}

class Game {
  constructor(container, onScore, onRings, onWin, onFail) {
    this.container = container;
    this.container.innerHTML = "";
    this.onScore = onScore;
    this.onRings = onRings;
    this.onWin = onWin;
    this.onFail = onFail;
    this.remaining = 20;
    this.score = 0;
    this.targets = [];
    this.nextColor = null;
    this.indicatorEl = null;
    this.setupTargets();
    this._spawnIndicator();
    this.onRings(this.remaining);
  }

  setupTargets() {
    // 響應式設計：以百分比定位 targets，並與 shelves-bar 對齊
    const rows = 4, cols = 6;
    // 每行對應的橫條 top 百分比
    const barTops = [0.25, 0.40, 0.55, 0.70]; // 25%, 40%, 55%, 70%
    itemConfigs.sort(() => Math.random() - 0.5).forEach((cfg, idx) => {
      const r = Math.floor(idx / cols), c = idx % cols;
      const topPercent = barTops[r] * 100;
      const leftPercent = (c + 0.5) * (100 / cols); // 0.5 為置中
      const el = document.createElement("div");
      el.className = "target";
      Object.assign(el.style, {
        position: "absolute",
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        transform: "translate(-50%, -80%)", // 底部略微壓到橫條
        width: "clamp(28px, 12vw, 56px)",
        height: "clamp(28px, 12vw, 56px)",
        zIndex: 2
      });
      const img = document.createElement("img");
      img.src = cfg.img;
      img.draggable = false;
      Object.assign(img.style, { width: "100%", height: "100%" });
      el.appendChild(img);
      el.addEventListener("click", () => this.handleThrow(cfg, el));
      this.container.appendChild(el);
      this.targets.push({ el, cfg, caught: false, catchRate: cfg.rate });
    });
  }
  

  _spawnIndicator() {
    // 移除舊的
    if (this.indicatorEl) this.indicatorEl.remove();
    // 選色
    const color = ringColors[Math.floor(Math.random() * ringColors.length)];
    this.nextColor = color;
    // 生成 canvas 上色
    const baseImg = new Image();
    baseImg.src = ringBase.src;
    baseImg.onload = () => {
      const cvs = document.createElement("canvas");
      cvs.width = baseImg.width;
      cvs.height = baseImg.height;
      const ctx = cvs.getContext("2d");
      ctx.drawImage(baseImg, 0, 0);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      // 建立 indicator
      const ind = document.createElement("img");
      ind.className = "indicator";
      ind.src = cvs.toDataURL();
      Object.assign(ind.style, { position: "absolute", left: "50%", bottom: "12px", top: "auto", transform: "translateX(-50%)", width: `55px`, height: `55px`, pointerEvents: "none" });
      this.container.appendChild(ind);
      this.indicatorEl = ind;
    };
  }

  handleThrow(cfg, el) {
    if (this.remaining <= 0) return; // 沒圈圈了不做
    this.remaining -= 1;
    this.onRings(this.remaining);
  
    const targetObj = this.targets.find(t => t.el === el);

    // 這裡計算 x, y，兩邊都能用
    const rect = el.getBoundingClientRect();
    const pr = this.container.getBoundingClientRect();
    const x = rect.left - pr.left + rect.width / 2;
    const y = rect.top - pr.top + rect.height / 2;
    const color = this.nextColor;

    // 命中判斷
    if (targetObj && !targetObj.caught && Math.random() <= cfg.rate) {
      targetObj.caught = true;
      // 套圈動畫與加分
      const ring = new Ring(color);
      ring.spawn(this.container);
      ring.throwTo(x, y, () => {
        // overlay
        const ovImg = new Image();
        ovImg.src = ringOverlay.src;
        ovImg.onload = () => {
          const cvs = document.createElement("canvas");
          cvs.width = ovImg.width;
          cvs.height = ovImg.height;
          const ctx = cvs.getContext("2d");
          ctx.drawImage(ovImg, 0, 0);
          ctx.globalCompositeOperation = "source-in";
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, cvs.width, cvs.height);
          const ov = document.createElement("img");
          ov.className = "overlay";
          ov.src = cvs.toDataURL();
          Object.assign(ov.style, { width: "100%", height: "100%" });
          el.appendChild(ov);
        };
      });
      this.score += cfg.value;
      this.onScore(this.score);
    } else {
      // 沒套中
      const ring = new Ring(color);
      ring.spawn(this.container);
      ring.throwTo(x, y, null, true); // miss = true
    }
  
    // === 這裡不管有沒有命中都要檢查剩餘 ===
    if (this.remaining > 0) {
      this._spawnIndicator();
    } else {
      if (this.indicatorEl) this.indicatorEl.remove();
      if (this.remaining === 0) {
        if (this.score >= 150) this.onWin();
        else this.onFail();
      }
      
    }
  }
  
}

export default function Game4Canvas() {
  const { user, login } = useAuth();
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(20);
  const [win, setWin] = useState(false);
  const [fail, setFail] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) new Game(ref.current, setScore, (r) => setRemaining(r), () => setWin(true), () => setFail(true));
  }, []);

  async function handleAgainWin() {
    setWin(false);
    setScore(0);
    setRemaining(20);
    if (ref.current) {
      ref.current.innerHTML = "";
      new Game(ref.current, setScore, (r) => setRemaining(r), () => setWin(true), () => setFail(true));
    }
    if (user?.username) {
      const newScore = (user.score || 0) + 1;
      await fetch("/api/auth", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user.username, score: newScore }) });
      login({ ...user, score: newScore });
    }
  }
  function handleAgainFail() {
    setFail(false);
    setScore(0);
    setRemaining(20);
    if (ref.current) {
      ref.current.innerHTML = "";
      new Game(ref.current, setScore, (r) => setRemaining(r), () => setWin(true), () => setFail(true));
    }
  }

  return (
    <div className="game-wrapper">
      <div className="sidebar">
        <p className="sidebar-title">物品分值對照表</p>
        <div className="value-table">
          {sidebarConfigs.map((i, idx) => (
            <React.Fragment key={idx}>
              <img src={i.img} alt="item" />
              <div className="value">{i.value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="play-area">
        {/* 四條橫的長條 */}
        <div className="shelves-bar bar1" />
        <div className="shelves-bar bar2" />
        <div className="shelves-bar bar3" />
        <div className="shelves-bar bar4" />
        <div ref={ref} className="ring-container" style={{ position: "relative", width: "100%", height: "100%" }} />
      </div>
      <div className="score-panel">
        <div className="score-display"><span className="label">SCORE:</span><span className="value">{score}</span></div>
        <div className="remaining-display"><span className="label">剩餘圈數</span><span className="value">{remaining}</span><img src={ringStack.src} className="remaining-icon" alt="remaining" /></div>
      </div>
      {win && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div className="game-overlay game-overlay-portal"><div className="game-dialog"><h2>挑戰成功！</h2><div className="button-group"><button onClick={handleAgainWin}>再玩一次</button><button onClick={() => (window.location.href = "/menu")}>回到選單</button></div></div></div>,
        document.body
      )}
      {fail && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div className="game-overlay game-overlay-portal"><div className="game-dialog"><h2>挑戰失敗！</h2><div className="button-group"><button onClick={handleAgainFail}>再玩一次</button><button onClick={() => (window.location.href = "/menu")}>回到選單</button></div></div></div>,
        document.body
      )}
    </div>
  );
}
