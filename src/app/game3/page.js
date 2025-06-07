'use client';

import { useEffect, useState } from 'react';

const maskImages = [
  'c1.png', 'c2.png', 'c3.png', 'c4.png', 'c5.png', 'c6.png',
  'c7.png', 'c8.png', 'c9.png', 'c10.png', 'c11.png', 'c12.png',
];

function initializeCards() {
  const selected = maskImages.sort(() => Math.random() - 0.5).slice(0, 12);
  const duplicated = [...selected, ...selected];
  const shuffled = duplicated.sort(() => Math.random() - 0.5);
  return shuffled.map((img, index) => ({
    id: index,
    image: img,
    flipped: false,
    matched: false,
    justMatched: false,
  }));
}

export default function App() {

  const [cards, setCards] = useState(() => initializeCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(true);
  const [result, setResult] = useState('playing');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft === 0) {
      setResult('fail');
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (cards.length && cards.every(card => card.matched)) {
      setResult('success');
      setIsPlaying(false);
    }
  }, [cards]);

  const handleCardClick = (index) => {
    if (flippedCards.length >= 2 || cards[index].flipped || cards[index].matched) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].image === newCards[second].image) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        newCards[first].justMatched = true;
        newCards[second].justMatched = true;
        setCards([...newCards]);
        setFlippedCards([]);
        setScore(score + 1);
        setTimeout(() => {
          newCards[first].justMatched = false;
          newCards[second].justMatched = false;
          setCards([...newCards]);
        }, 500);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 500);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{
      height: 'calc(100vh - 160px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 120,
      marginBottom: 140,
      border: '3px solid #C5AC6B',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      position: 'relative',
      backgroundImage: 'url(/g3/g3bg.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      padding: '1rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>
        <div>PLAYER_ID</div>
        <div>SCORE: {score}</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{formatTime(timeLeft)}</div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '0.5rem',
          maxWidth: '720px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            style={{
              perspective: '1000px',
              width: '80px',
              height: '80px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                animation: card.justMatched ? 'flash 0.5s ease' : 'none',
              }}
            >
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                
                overflow: 'hidden',
              }}>
              <img
                src={`/g3/c0.png`}
                alt="mask"
                style={{ width: '100%', height: '100%' }}
              />
              </div>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                
                overflow: 'hidden',
              }}>
                <img
                  src={`/g3/${card.image}`}
                  alt="mask"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {result !== 'playing' && (
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
          {result === 'success' ? '🎉 你成功配對所有面具！' : '💀 時間到，挑戰失敗！'}
        </div>
      )}
    </div>
  );
}