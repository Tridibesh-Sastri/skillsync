import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import NavDock from './components/NavDock';
import Dashboard from './pages/Dashboard';
import JobMarket from './pages/JobMarket';
import Arena from './pages/Arena';



function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative font-sans flex items-center justify-center">
      {/* 
        The layout logic here:
        The updated pages (Dashboard, JobMarket, Arena) all have their own specific max-w-md and background styles.
        So this App wrapper mainly provides the context and switching logic.
        However, NavDock is fixed position. If we are on mobile it's fine. 
        If on desktop, we might want to center the phone view.
        Since the user's design is explicitly `max-w-md mx-auto min-h-screen`, 
        we should allow the pages to handle their layout.
       */}

      <main className="h-full w-full relative">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'jobmarket' && <JobMarket />}
        {activeTab === 'arena' && <Arena />}
      </main>

      {/* Navigation - Conditional rendering or passed to pages?
          The user's HTML included a dock in page1 and page2.
          Arena (page3) had a different Action Control.
          We should show NavDock only on Dashboard and Oracle.
      */}
      {(activeTab === 'dashboard' || activeTab === 'jobmarket' || activeTab === 'profile') && (
        <NavDock activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
