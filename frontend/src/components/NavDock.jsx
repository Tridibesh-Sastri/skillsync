import React from 'react';

const NavDock = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'dashboard', icon: 'home', label: 'Base' },
        { id: 'jobmarket', icon: 'visibility', label: 'Oracle' }, // Renamed to Oracle to match ID but keeping label
        { id: 'arena', icon: 'school', label: 'Arena' }, // Arena was 'Skills' in design, but distinct
        { id: 'profile', icon: 'person', label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-6 left-4 right-4 h-16 rounded-2xl bg-[#1d1b2e]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between px-2">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                // Special styling for Center FAB if we had one, but layout is flat 4 items.
                // The design in page1.html showed 5 items with a center FAB 'sync', but page 2 had 4.
                // I will stick to the functional tabs we have.

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className="flex-1 flex flex-col items-center justify-center gap-1 group"
                    >
                        <span className={`material-symbols-outlined text-2xl transition-all ${isActive
                                ? 'text-accent-neon drop-shadow-[0_0_8px_#00f3ff]'
                                : 'text-white/50 group-hover:text-white'
                            }`}>
                            {tab.icon}
                        </span>
                        <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-white' : 'text-white/50'
                            }`}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default NavDock;
