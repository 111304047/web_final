'use client';

import React from 'react';
import Link from 'next/link';

// 載入圖片
const iconMap = {
  game1: '/menu/gameIcon1.png',
  game2: '/menu/gameIcon2.png',
  game3: '/menu/gameIcon3.png',
  game4: '/menu/gameIcon4.png',
  game5: '/menu/gameIcon5.png',
  game6: '/menu/gameIcon6.png',
  game7: '/menu/gameIcon7.png',
  game8: '/menu/gameIcon8.png',
  game9: '/menu/gameIcon9.png',
  game10: '/menu/gameIcon10.png',
  game11: '/menu/gameIcon11.png',
  Home: '/menu/homeIcon.png',
};

const menuItems = [
  { label: 'game1', href: '/game1' },
  { label: 'game2', href: '/game2' },
  { label: 'game3', href: '/game3' },
  { label: 'game4', href: '/game4' },
  { label: 'game5', href: '/game5' },
  { label: 'game6', href: '/game6' },
  { label: 'game7', href: '/game7' },
  { label: 'game8', href: '/game8' },
  { label: 'game9', href: '/game9' },
  { label: 'game10', href: '/game10' },
  { label: 'game11', href: '/game11' },
  { label: 'Home', href: '/' },
];

export default function Menu() {
  return (
    <div style={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        marginTop: 120,
        marginBottom: 140,
        border: '3px solid #C5AC6B',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        position: 'relative',
    }}>
      <div className="menu-scroll" style={{
        width: '97%',
        overflowX: 'auto',
        paddingBottom: 18,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(2, 150px)',
          gap: '24px',
          width: '1800px',
          margin: '0 auto',
        }}>
          {menuItems.map((item, idx) => (
            <Link key={item.href} href={item.href} className="menu-link" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              //border: '2px solid #C5AC6B', 
              borderRadius: '16px', 
              color:'#C5AC6B',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              height: '100%',
              transition: 'background 0.2s',
              padding: 0,
            }}>
              <img
                src={iconMap[item.label]}
                alt={item.label}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: '16px', 
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        .menu-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .menu-scroll::-webkit-scrollbar-thumb {
          background: rgba(197, 172, 107, 0.5);
          border-radius: 6px;
          transition: background 0.2s;
        }
        .menu-scroll:hover::-webkit-scrollbar-thumb,
        .menu-scroll:active::-webkit-scrollbar-thumb,
        .menu-scroll:focus::-webkit-scrollbar-thumb {
          background: rgba(197, 172, 107, 0.10);
        }
        .menu-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        /* Firefox */
        .menu-scroll {
          scrollbar-color: rgba(197,172,107,0.5) transparent;
          scrollbar-width: thin;
        }
        .menu-scroll:hover,
        .menu-scroll:active,
        .menu-scroll:focus {
          scrollbar-color: rgba(197,172,107,0.5) transparent;
        }
        /* Link 預設、hover/active/focus 狀態字樣顏色 */
        .menu-link {
          color: #C5AC6B;
        }
        .menu-link:hover,
        .menu-link:active,
        .menu-link:focus {
          color: #C5AC6B;
        }
      `}</style>
    </div>
  );
}