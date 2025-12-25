import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { RoomsPage } from './components/RoomsPage'
import { PartiesPage } from './components/PartiesPage'
import { PromotionsPage } from './components/PromotionsPage'
import { MembersPage } from './components/MembersPage'
import { AdminPage } from './components/Admin'
import { ReceptionistPage } from './components/Receptionist/ReceptionistPage'
import { AppFooter } from './components/Footer'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './App.css'

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes (no header/footer) */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Receptionist Routes (no header/footer) */}
        <Route path="/receptionist" element={<ReceptionistPage />} />

        {/* Public Routes (with header/footer) */}
        <Route
          path="/*"
          element={
            <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Header />

              <Layout.Content style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rooms" element={<RoomsPage />} />
                  <Route path="/parties" element={<PartiesPage />} />
                  <Route path="/promotions" element={<PromotionsPage />} />
                  <Route path="/members" element={<MembersPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </Layout.Content>

              <AppFooter />
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}
