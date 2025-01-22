import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Form from './components/~Form.jsx'
import TogglePlug from './components/~TogglePlug.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <>
  <Navbar/>
  <App />
  <Footer />
  </>
)