// src/App.js
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { db, auth, provider } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Home from './Home';
import Music from './Music';
import Video from './Video';
import Search from './Search';
// 追加：Service Worker 登録用ユーティリティ
import { register } from './serviceWorkerRegistration';

function App() {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // PWA の Service Worker 登録
  useEffect(() => {
    register();
  }, []);

  // 曲リスト取得
  useEffect(() => {
    const fetchSongs = async () => {
      const snap = await getDocs(collection(db, 'songs'));
      const list = snap.docs.map(doc => doc.data());
      setSongs(list);
    };
    fetchSongs();
  }, []);

  // Google ログイン状態監視
  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, provider).catch(console.error);
  };
  const handleLogout = () => {
    signOut(auth);
  };

  const playSong = (song) => {
    // 同じ曲なら停止
    if (currentSong?.url === song.url) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentSong(null);
      return;
    }
    // 別曲なら切り替え
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(song.url);
    audio.play();
    audioRef.current = audio;
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/music"
            element={
              <Music
                songs={songs}
                playSong={playSong}
                currentSong={currentSong}
                isPlaying={isPlaying}
              />
            }
          />
          <Route path="/video" element={<Video />} />
          <Route path="/search" element={<Search />} />
        </Routes>

        <nav className="bottom-nav">
          <Link to="/"><i className="fa-solid fa-house"></i></Link>
          <Link to="/music"><i className="fa-solid fa-music"></i></Link>
          <Link to="/video"><i className="fa-solid fa-video"></i></Link>
          <Link to="/search"><i className="fa-solid fa-magnifying-glass"></i></Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
