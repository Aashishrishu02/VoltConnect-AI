import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { EVRoutePlannerPage } from './pages/EVRoutePlannerPage';
import { BecomeHostPage } from './pages/BecomeHostPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { WalletPage } from './pages/WalletPage';
import { AIChatPage } from './pages/AIChatPage';
import { AuthModal } from './pages/AuthPages';

export function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
                <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage onOpenAuth={() => setAuthModalOpen(true)} />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/route-planner" element={<EVRoutePlannerPage />} />
                    <Route path="/ai-chat" element={<AIChatPage />} />
                    <Route path="/become-host" element={<BecomeHostPage />} />
                    <Route path="/host-dashboard" element={<HostDashboardPage />} />
                    <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                  </Routes>
                </main>

                <Footer />

                <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
              </div>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
