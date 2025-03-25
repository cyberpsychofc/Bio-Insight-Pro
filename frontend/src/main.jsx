import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './App.jsx'
import Similarity from './pages/Similarity.jsx'
import BioAlign from './pages/BioAlign.jsx';
import Services from './pages/Services.jsx';
import About from './pages/About.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/similarity" element={<Similarity />} />
        <Route path="/align" element={<BioAlign />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </BrowserRouter>
  </>
)
