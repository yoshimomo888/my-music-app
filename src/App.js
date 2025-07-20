// src/App.js
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { db, auth, provider } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { AudioProvider } from './AudioContext';
import Home from './Home';
import Music from './Music';
import Video from './Video';
import Search from './Search';

function App() {
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);

  // ログイン状態の監視
  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  // お気に入り取得（UI は非表示中）
  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDocs(collection(db, `users/${user.uid}/favorites`));
      setFavorites(snap.docs.map(d => decodeURIComponent(d.id)));
    })();
  }, [user]);

  // 曲一覧取得
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'songs'));
      setSongs(snap.docs.map(d => d.data()));
    })();
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, provider).catch(console.error);
  };
  const handleLogout = () => signOut(auth);

  // 表示リスト
  const visibleSongs = showFavoritesOnly
    ? songs.filter(s => favorites.includes(s.url))
    : songs;

  return (
    <AudioProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>Player</h1>
            <div>
              {user ? (
                <>
                  <span>{user.displayName}</span>
                  <button onClick={handleLogout}>ログアウト</button>
                </>
              ) : (
                <button onClick={handleLogin}>Googleでログイン</button>
              )}
            </div>
          </header>

          <main className="app-main">
            {/* お気に入りボタン非表示中 */}
            {/* <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
              {showFavoritesOnly ? '全曲表示' : 'お気に入りだけ'}
            </button> */}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/music"
                element={
                  <Music
                    songs={visibleSongs}
                  />
                }
              />
              <Route path="/video" element={<Video />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>

          <nav className="bottom-nav">
            <Link to="/"><i className="fa-solid fa-house"></i></Link>
            <Link to="/music"><i className="fa-solid fa-music"></i></Link>
            <Link to="/video"><i className="fa-solid fa-video"></i></Link>
            <Link to="/search"><i className="fa-solid fa-magnifying-glass"></i></Link>
          </nav>
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
