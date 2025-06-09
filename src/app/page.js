'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [btnScale, setBtnScale] = React.useState(1);
  const [iconAnim, setIconAnim] = React.useState(false);

  // 進入動畫結束後導向
  React.useEffect(() => {
    if (iconAnim) {
      const timer = setTimeout(() => {
        router.push('/menu');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [iconAnim, router]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)', // 預留上方空間與下方 bar
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      marginTop: 120, // 預留更高的上方空間
      marginBottom: 140, // 下方空間縮小，內容往上移動
      border: '3px solid #C5AC6B',
      // borderRadius: 0, // 不要圓角
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      position: 'relative',
    }}>
      <div
        style={{
          width: 'min(max(40vw, 180px), 360px)',
          height: 'min(max(22vw, 100px), 200px)',
          borderRadius: 'min(max(4vw, 16px), 32px)',
          overflow: 'hidden',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
        }}
      >
        <img
          src="/menu/home.png"
          alt="Home Icon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 'min(max(4vw, 16px), 40px)',
            transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
            transform: iconAnim ? 'scale(2.2)' : 'scale(1)',
            opacity: iconAnim ? 0 : 1,
          }}
        />
      </div>
      <button
        style={{
          marginTop: 40,
          padding: '12px 36px',
          background: '#C5AC6B',
          color: '#fff',
          fontSize: 20,
          fontWeight: 700,
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.18s cubic-bezier(0.4,0,0.2,1)',
        transform: `scale(${btnScale})`,
      }}
      onMouseEnter={() => setBtnScale(1.08)}
      onMouseLeave={() => setBtnScale(1)}
      onMouseDown={() => setBtnScale(0.95)}
      onMouseUp={() => setBtnScale(1.08)}
      onClick={() => {
        setIconAnim(true);
      }}
      >
        進入
      </button>
    </div>
  );
}
