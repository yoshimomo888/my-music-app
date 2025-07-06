// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Music from './Music';

function Home() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Player</h1>
      </header>
      <main className="app-main">
        <p>ホーム画面です</p>
      </main>
    </div>
  );
}

function Video() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Video Page</h1>
      </header>
      <main className="app-main">
        <p>ここに映像コンテンツが入ります。</p>
      </main>
    </div>
  );
}

function Search() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Search Page</h1>
      </header>
      <main className="app-main">
        <p>ここに検索機能が入ります。</p>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
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
