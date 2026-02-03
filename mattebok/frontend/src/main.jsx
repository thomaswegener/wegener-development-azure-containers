import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import KapittelSide from './pages/KapittelSide'
import Profil from './pages/Profil'
import Login from './pages/Login'
import Registrer from './pages/Registrer'
import AdminPanel from './pages/AdminPanel'
import Elever from './pages/Elever'

import { AuthProvider } from './context/AuthContext'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/kapittel/:nummer" element={<KapittelSide />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrer" element={<Registrer />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/elever" element={<Elever />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)