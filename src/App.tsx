import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './config/wagmi';
import { ContractProvider } from './context/ContractContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { BrowseJobs } from './pages/BrowseJobs';
import { JobDetail } from './pages/JobDetail';
import { PersonalDashboard } from './pages/PersonalDashboard';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#d47e30',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          <ContractProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-[#FDFBD4] text-[#2b1700]">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<BrowseJobs />} />
                    <Route path="/job/:id" element={<JobDetail />} />
                    <Route path="/dashboard" element={<PersonalDashboard />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </ContractProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
