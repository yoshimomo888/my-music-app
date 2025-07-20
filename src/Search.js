// src/Search.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';  // 追加

const Search = () => {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();               // 追加

  // ① Firestore から全曲をフェッチ
  useEffect(() => {
    const fetchSongs = async () => {
      const snap = await getDocs(collection(db, 'songs'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(list);
    };
    fetchSongs();
  }, []);

  // ② クエリにマッチする曲だけを抽出
  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(query.toLowerCase()) ||
    song.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>曲を検索🔍</h2>
      
      {/* ③ 検索ボックス */}
      <input
        type="text"
        placeholder="タイトル or アーティスト名を入力"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '1rem',
          marginBottom: '16px',
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      {/* ④ 結果リスト */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(song => (
          <li
            key={song.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{song.title} — {song.artist}</span>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
              onClick={() => {
                // ⑤ navigate で /music に遷移しつつ、state に再生対象をセット
                navigate('/music', { state: { autoPlay: song } });
              }}
            >
              ▶︎
            </button>
          </li>
        ))}

        {filtered.length === 0 && (
          <li style={{ color: '#666' }}>見つかりませんでした…</li>
        )}
      </ul>
    </div>
  );
};

export default Search;
