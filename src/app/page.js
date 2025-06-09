'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
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
          width: 280,
          height: 154,
          borderRadius: 32,
          overflow: 'hidden',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
        }}
      >
        <img
          src="/menu/homeIcon.png"
          alt="Home Icon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
      {/*<h1 style={{ color: '#C5AC6B', fontSize: 32, fontWeight: 700, marginTop: 24 }}>Home Page</h1>*/}
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
      }}
      onClick={() => router.push('/menu')}
      >
        進入
      </button>
    </div>
  );
}
