// src/Video.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from './firebase';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [joinedAt] = useState(() =>
    // 実際は auth.currentUser.metadata.creationTime を使いますが
    // 例として 2 ヶ月前
    dayjs().subtract(2, 'month')
  );

  useEffect(() => {
    const fetchVideos = async () => {
      const snap = await getDocs(collection(db, 'videos'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(list);
    };
    fetchVideos();
  }, []);

  const months = dayjs().diff(joinedAt, 'month');

  return (
    <div className="video-page" style={{ padding: 20 }}>
      <h2>おすすめ映像🎬</h2>

      <div className="video-list">
        {videos
          .filter(v => v.requiredMonths <= months)
          .map(v => (
            <div key={v.id} className="video-card" style={{ margin: '0 16px 32px', flex: '0 0 auto' }}>
              <h3>{v.title} — {v.band}</h3>

              {/* サムネイル */}
              {v.thumbnail && (
                <img
                  src={v.thumbnail}
                  alt={`${v.title} のサムネイル`}
                  style={{
                    display: 'block',
                    width: 320,
                    height: 180,
                    objectFit: 'cover',
                    marginBottom: 8,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const modal = document.getElementById(`video-modal-${v.id}`);
                    if (modal) modal.classList.add('show');
                  }}
                />
              )}

              {/* 動画モーダル */}
              <div
                id={`video-modal-${v.id}`}
                className="video-modal"
                onClick={e => {
                  if (e.target.classList.contains('video-modal')) {
                    e.currentTarget.classList.remove('show');
                  }
                }}
                style={{
                  display: 'none',
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000,
                }}
              >
                <div
                  className="video-modal-inner"
                  style={{ width: '80%', maxWidth: 800 }}
                >
                  <video
                    width="100%"
                    controls
                    src={v.url}
                    autoPlay
                    style={{ borderRadius: 4 }}
                  >
                    お使いのブラウザは video タグに対応していません。
                  </video>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Video;
