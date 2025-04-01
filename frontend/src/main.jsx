import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './App.jsx'
import Similarity from './pages/Similarity.jsx'
import BioAlign from './pages/BioAlign.jsx';
import BioMap from './pages/BioMap.jsx';
import About from './pages/About.jsx';
import ParticlesBackground from './components/ui/ParticlesBackground.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Navbar />
      <ParticlesBackground />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/similarity" element={<Similarity />} />
        <Route path="/align" element={<BioAlign />} />
        <Route path="/biomap" element={<BioMap />} />
      </Routes>
    </BrowserRouter>
  </>
)
