import React from 'react'
import {
  BrowserRouter as Router, 
  Routes,
  Route, 
  Navigate,
  Outlet,
} from 'react-router-dom';

import './App.css'
import Navbar from './articles/Navbar/Navbar.jsx';
import Adminpanel from './pages/adminpanel/Adminpanel.jsx';
import './index.css'
import Leaderboard from './pages/Leaderboard/LeaderPage.jsx';
import InfluencerPage from './pages/InfluencerPage/InfluencerPage.jsx';
import { InfluencerProvider } from './Context/InfluencerContext.jsx';

// Layout con Navbar que envuelve todas las páginas
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* Renderiza las rutas hijas */}
    </div>
  )
}

function App() {
  return (
    <InfluencerProvider>
      <Router> 
        <Routes>
          {/* Layout como ruta padre */}
          <Route path="/" element={<Layout />}>
            {/* Ruta de inicio */}
            <Route index element={<Adminpanel />} />
            
            {/* Ruta de Leaderboard */}
            <Route path="leaderboard" element={<Leaderboard />} />
            
            {/* Ruta de Influencer Page */}
            <Route path="influencer/details" element={<InfluencerPage />} />
            
            {/* Ruta de redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </InfluencerProvider>
  )
}

export default App;