import React from 'react';
import { useGame } from '../context/GameContext';
import SkillGraphViewer from '../components/SkillGraphViewer';

const Dashboard = () => {
  const { xp, streak, userLevel } = useGame();
  // XP needed for next level: simply 100 * level (or just 100 per level for demo)
  const nextLevelXp = userLevel * 100;
  const progressPercent = Math.min((xp % 100) / 100 * 100, 100);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto overflow-hidden shadow-2xl border-x border-primary-blue/20 bg-background-dark font-display">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(rgba(46, 11, 218, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(46, 11, 218, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }}></div>

      {/* Top App Bar */}
      <header className="relative z-10 flex items-center p-4 pt-6 justify-between bg-gradient-to-b from-background-dark/90 to-transparent backdrop-blur-sm sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-accent-neon rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative bg-center bg-no-repeat bg-cover rounded-full size-10 border border-white/10"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtfaPW0ypXmHWr8Z2aSfMkoMfF8k9LY8rW30Ob1eLFrEqd5zqdJtqglIVsxDekCBvt0vNFPAG-pvrEb42NCB5vypEQxkoNPY4cRmubY_btIxV_6qjZ8cd3b07Bi0FpV_LSyqHj8xcBVtNwPw2QBc3MIJRxW5dLamt_ZC1UDMUQvaoKlS569xi6pZAh0NSaW4HtKUoVuBFu9wHzsWK5vkwEydpFIZx1Jx2RK3-qT7NGgHHK0aQ8iSBCxBxzZa3jejZDCkgLdMz5WOFV")' }}
            ></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-accent-neon uppercase tracking-widest font-bold">Online</span>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Pilot Zero</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-full size-10 text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex items-center justify-center rounded-full size-10 text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Scroll Area */}
      <main className="relative z-10 flex-1 flex flex-col gap-6 px-4 pb-28 overflow-y-auto">
        {/* Level Progress Section */}
        <section className="flex flex-col gap-2 pt-2">
          <div className="flex justify-between items-end px-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tighter">LVL {userLevel}</span>
              <span className="text-sm text-primary-blue font-medium tracking-widest uppercase">Elite</span>
            </div>
            <span className="text-white/60 text-xs font-mono">{xp % 100} / 100 XP</span>
          </div>
          <div className="relative h-3 w-full bg-surface-dark rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-blue to-accent-neon shadow-[0_0_10px_rgba(46,11,218,0.6)] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}></div>
          </div>
        </section>

        {/* Streak Card */}
        <section>
          <div className="relative overflow-hidden rounded-xl bg-surface-dark border border-primary-blue/30 p-4 shadow-lg group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 blur-[50px] -mr-10 -mt-10 rounded-full"></div>
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-accent-neon text-xs font-bold uppercase tracking-wider">Streak Status</p>
                <p className="text-white text-2xl font-bold leading-tight">{streak} Day Streak</p>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 w-fit">
                  <span className="material-symbols-outlined text-orange-500 text-[16px]">local_fire_department</span>
                  <span className="text-orange-400 text-xs font-bold uppercase">Ignited</span>
                </div>
              </div>
              <div className="relative flex items-center justify-center size-16 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-yellow-400 rounded-full blur opacity-20 animate-pulse"></div>
                <span className="material-symbols-outlined text-orange-500 text-5xl drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]">local_fire_department</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skill Matrix Graph */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-white text-base font-bold uppercase tracking-widest border-l-2 border-accent-neon pl-2">Skill Frequency</h3>
            <button className="text-xs text-primary-blue hover:text-accent-neon transition-colors font-medium">View Full Report</button>
          </div>
          <div className="relative rounded-xl border border-white/10 bg-surface-dark/80 backdrop-blur-md p-5 shadow-neon overflow-hidden h-64 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/50 text-xs font-mono mb-1">CURRENT SYNC</p>
                <p className="text-white text-2xl font-bold truncate">Active</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs font-mono mb-1">GROWTH</p>
                <p className="text-accent-neon text-lg font-bold font-mono">+12%</p>
              </div>
            </div>

            {/* Replaced static SVG with proper SkillGraphViewer embedded */}
            <div className="flex-1 w-full rounded-lg overflow-hidden border border-white/5 relative">
              <SkillGraphViewer />
            </div>
          </div>
        </section>

        {/* Daily Operations (Quests) */}
        <section className="flex flex-col gap-3">
          <h3 className="text-white text-base font-bold uppercase tracking-widest border-l-2 border-accent-pink pl-2">Daily Operations</h3>

          <div className="group relative flex items-center gap-4 rounded-xl bg-surface-dark border border-white/5 p-4 active:scale-[0.98] transition-all duration-200">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-neon rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-background-dark border border-white/10 text-accent-neon shadow-[0_0_10px_rgba(0,243,255,0.1)]">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <h4 className="text-white text-sm font-bold">Complete 1 Lesson</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 bg-white/5 px-1.5 py-0.5 rounded">Core Skills</span>
                <span className="text-xs text-accent-neon font-medium">+50 XP</span>
              </div>
            </div>
            <div className="flex items-center justify-center size-8 rounded-full border-2 border-dashed border-white/20">
              <span className="block size-2 rounded-full bg-white/20"></span>
            </div>
          </div>

          <div className="group relative flex items-center gap-4 rounded-xl bg-surface-dark border border-white/5 p-4 active:scale-[0.98] transition-all duration-200">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-pink rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-background-dark border border-white/10 text-accent-pink shadow-[0_0_10px_rgba(255,0,255,0.1)]">
              <span className="material-symbols-outlined">stadia_controller</span>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <h4 className="text-white text-sm font-bold">Practice Mode: 15min</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 bg-white/5 px-1.5 py-0.5 rounded">Training</span>
                <span className="text-xs text-accent-pink font-medium">+20 XP</span>
              </div>
            </div>
            <button className="flex items-center justify-center h-8 px-3 rounded bg-primary-blue/20 hover:bg-primary-blue/40 text-primary-blue hover:text-white border border-primary-blue/30 text-xs font-bold uppercase transition-colors">
              Start
            </button>
          </div>
        </section>
      </main>

      {/* Background Spacers for Mobile Nav */}
      <div className="h-4 w-full bg-transparent"></div>
    </div>
  );
};

export default Dashboard;
