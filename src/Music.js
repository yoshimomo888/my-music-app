// src/Music.js
import React from 'react';
import { useAudio } from './AudioContext';

export default function Music({ songs }) {
  const { currentTrack, isPlaying, play } = useAudio();

  return (
    <div>
      <h2>♪ 曲一覧</h2>
      <ul className="song-list">
        {songs.map((song, i) => (
          <li key={i}>
            <button
              className="play-button"
              onClick={() => play(song.url)}
            >
              {currentTrack === song.url && isPlaying ? '⏸ 停止' : '▶ 再生'}
            </button>
            {song.title} — {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
