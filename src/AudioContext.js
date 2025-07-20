// src/AudioContext.js
import React, { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (url) => {
    const audio = audioRef.current;
    if (audio.src === url) {
      // 同じトラックならトグル
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else        { audio.play();  setIsPlaying(true);  }
    } else {
      // 別トラックに切り替え
      audio.src = url;
      audio.play();
      setCurrentTrack(url);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, play, stop }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
