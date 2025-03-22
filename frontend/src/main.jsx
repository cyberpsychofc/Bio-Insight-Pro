import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './App.jsx'
import Similarity from './pages/Similarity.jsx'
import BioAlign from './pages/BioAlign.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/similarity" element={<Similarity />} />
        <Route path="/bioalign" element={<BioAlign />} />
      </Routes>
    </BrowserRouter>
  </>
)
