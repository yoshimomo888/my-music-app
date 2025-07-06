import './App.css';
import { useState, useRef, useEffect } from 'react';
import { db, auth, provider } from './firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const encodeUrl = (url) => encodeURIComponent(url);
const decodeUrl = (encoded) => decodeURIComponent(encoded);

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      const favRef = collection(db, `users/${user.uid}/favorites`);
      const snapshot = await getDocs(favRef);
      const urls = snapshot.docs.map(doc => decodeUrl(doc.id));
      setFavorites(urls);
    };
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const fetchSongs = async () => {
      const songsRef = collection(db, 'songs');
      const snapshot = await getDocs(songsRef);
      const loadedSongs = snapshot.docs.map(doc => doc.data());
      setSongs(loadedSongs);
    };
    fetchSongs();
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, provider).catch(err => {
      alert("ログインに失敗しました");
      console.error(err);
    });
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const visibleSongs = showFavoritesOnly
    ? songs.filter(song => favorites.includes(song.url))
    : songs;

  const playSong = (song) => {
    if (currentSong?.url === song.url) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentSong(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(song.url);
    audio.play();
    audioRef.current = audio;

    setCurrentSong(song);
    setIsPlaying(true);
  };

  // お気に入り切り替え機能は残すが、ボタンは非表示に
  const toggleFavorite = async (song) => {
    if (!user) return alert("ログインしてね！");
    const docId = encodeUrl(song.url);
    const docRef = doc(db, `users/${user.uid}/favorites`, docId);

    if (favorites.includes(song.url)) {
      await deleteDoc(docRef);
      setFavorites(favorites.filter(favUrl => favUrl !== song.url));
    } else {
      await setDoc(docRef, {
        title: song.title,
        artist: song.artist,
        url: song.url,
        image: song.image,
      });
      setFavorites([...favorites, song.url]);
    }
  };

  return (
    <div className="app">
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
        {/* ↓ この部分を非表示に */}
        {/* <button
          className="toggle-button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          {showFavoritesOnly ? '全曲を表示' : 'お気に入りだけ表示'}
        </button> */}

        {currentSong && (
          <div className="now-playing">
            <img src={currentSong.image} alt="ジャケット画像" className="jacket" />
            <h2>{currentSong.title} - {currentSong.artist}</h2>
          </div>
        )}

        <ul className="song-list">
          {visibleSongs.map((song, index) => (
            <li key={index}>
              <button className="play-button" onClick={() => playSong(song)}>
                {currentSong?.url === song.url && isPlaying ? '⏸ 停止' : '▶ 再生'}
              </button>

              {/* ↓ このお気に入りボタンも非表示に */}
              {/* <button
                className={`heart-button ${favorites.includes(song.url) ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(song)}
              >
                {favorites.includes(song.url) ? '★' : '☆'}
              </button> */}

              {song.title} - {song.artist}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
