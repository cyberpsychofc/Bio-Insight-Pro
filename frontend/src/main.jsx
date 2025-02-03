import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar.jsx'
import TitleCard from './components/TitleCard.jsx';
import Form from './components/Form.jsx'
import TogglePlug from './components/TogglePlug.jsx'
import Table from './components/Table.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <Navbar />
    <TitleCard/>
    <App />
  </>
)