// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Music from './Music';
import Video from './Video';
import Search from './Search';
import Home from './Home';

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
