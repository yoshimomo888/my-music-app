// src/Music.js
import React from 'react';

const Music = ({ songs, playSong, currentSong, isPlaying }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2>♪ 曲一覧</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {songs.map((song, idx) => (
          <li
            key={idx}
            style={{
              border: '1px solid #ddd',
              borderRadius: 6,
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              cursor: 'pointer',      // カーソルを pointer に
            }}
            onClick={() => playSong(song)}   // 行全体で再生/停止
          >
            <span>
              {song.title} — {song.artist}
            </span>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              {currentSong?.url === song.url && isPlaying
                ? '⏸'
                : '▶'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Music;
