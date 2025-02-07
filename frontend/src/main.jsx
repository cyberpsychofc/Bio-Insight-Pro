import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar.jsx'
import Form from './components/Form.jsx'
import TogglePlug from './components/TogglePlug.jsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import Table from './components/Table.jsx'
import App from './App.jsx'
import Similarity from './pages/Similarity.jsx'

createRoot(document.getElementById('root')).render(
  <>
  <Navbar />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/similarity" element={<Similarity />} />
      </Routes>
    </BrowserRouter>
  </>
)