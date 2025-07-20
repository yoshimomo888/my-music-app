// src/Home.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Home = () => {
  const [user, setUser] = useState(null);
  const [lastPlayed, setLastPlayed] = useState(null);

  // ① ログインユーザーを監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  // ② localStorage から前回再生曲を取得
  useEffect(() => {
    const data = localStorage.getItem('lastPlayed');
    if (data) {
      setLastPlayed(JSON.parse(data));
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Home</h1>
      </header>

      <main className="app-main">
        {/* ① プロフィールエリア */}
        <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
          {user ? (
            <>
              <p>👤 {user.displayName}</p>
              <p>📧 {user.email}</p>
            </>
          ) : (
            <p>ログインしていません</p>
          )}
        </section>

        {/* ② 前回再生した曲 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>前回再生した曲</h2>
          {lastPlayed ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '1rem'
            }}>
              <img
                src={lastPlayed.image}
                alt="ジャケット"
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div>
                <p style={{ margin: 0 }}>{lastPlayed.title}</p>
                <p style={{ margin: 0, color: '#666' }}>{lastPlayed.artist}</p>
              </div>
              <button
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  // 再生ボタンを押したら /music へ遷移して再生
                  // または playSong を呼び出す仕組みを後で追加
                  alert(`▶︎ 再生: ${lastPlayed.title}`);
                }}
              >
                ▶︎
              </button>
            </div>
          ) : (
            <p style={{ color: '#666' }}>まだ再生した曲がありません</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
