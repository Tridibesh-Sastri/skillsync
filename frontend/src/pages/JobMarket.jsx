import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import api from '../services/api';

const JobMarket = () => {
    const [jobTitle, setJobTitle] = useState('UX Designer'); // Default per design
    const [skills, setSkills] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addXp } = useGame();

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await api.scrapeAndAnalyzeJob(jobTitle);
            setSkills(response.data.top_skills);
            addXp(50, 'Scanner Complete');
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-void dark font-display text-white overflow-x-hidden selection:bg-primary selection:text-background-dark max-w-md mx-auto shadow-2xl">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(rgba(6, 234, 97, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 234, 97, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}></div>
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{
                background: 'linear-gradient(to bottom, rgba(6, 234, 97, 0), rgba(6, 234, 97, 0) 50%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.2))',
                backgroundSize: '100% 4px',
            }}></div>

            {/* Top App Bar */}
            <div className="relative z-10 flex items-center bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-primary/20 sticky top-0">
                <button className="text-primary flex size-12 shrink-0 items-center justify-center hover:bg-primary/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
                </button>
                <h2 className="text-primary text-sm tracking-[0.2em] font-bold flex-1 text-center pr-12 drop-shadow-[0_0_5px_rgba(6,234,97,0.8)]">
                    ORACLE // SYSTEM V.2.0
                </h2>
            </div>

            {/* Oracle Eye / Scanner */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center pt-8 pb-4">
                <div className="relative size-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow"></div>
                    <div className="absolute inset-2 rounded-full border border-dashed border-primary/40 animate-spin-reverse"></div>

                    <div className="size-32 rounded-full overflow-hidden border-2 border-primary shadow-neon-green relative z-10 bg-black">
                        <div className="absolute inset-0 bg-primary/20 animate-pulse z-20 mix-blend-overlay"></div>
                        <img alt="Oracle Eye" className="w-full h-full object-cover opacity-80"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7KPIGZA4Pml8uJJdH3lyk1eNZoXx0a825tWKom4fy4n06bUdlzHjn8n2OlMMo0WJGbJ-p-rJs2Jby7OfNPk4_LNC4k3CZqn6tUXp6y9pVaDcTQERJaUM0hrrG-oXYkZ6QUZ1M_O_RONy8tsQVCmM9ufoTcIxYLvGAQsLGx8SziAT_olHVjPbzwSC5ikJGRba2IkD43n10y-f7hChHYs4xCljhAR7HIT8GZzJtAcGPmMas7KdrUwtpSFBDHiIyOPF9IIVq-qQsiXJN"
                        />
                    </div>

                    {loading && (
                        <div className="absolute w-full h-0.5 bg-primary/80 shadow-[0_0_15px_#06ea61] top-1/2 left-0 animate-spin z-20"></div>
                    )}
                </div>
                <p className="text-primary/60 text-xs tracking-widest mt-4 animate-pulse">
                    {loading ? 'SYSTEM SCANNING...' : 'SYSTEM ONLINE // AWAITING INPUT'}
                </p>
            </div>

            {/* Input Section */}
            <div className="relative z-10 px-4 pt-2 pb-6">
                <h3 className="text-white tracking-widest text-xl font-bold leading-tight text-center pb-6 uppercase drop-shadow-md">
                    Designate Target Role
                </h3>
                <div className="flex max-w-[480px] mx-auto flex-col gap-4">
                    <label className="flex flex-col flex-1 group">
                        <div className="flex justify-between items-end pb-2">
                            <p className="text-primary text-xs font-bold tracking-widest uppercase">Job Protocol</p>
                            <span className="text-[10px] text-primary/50 font-mono">ID: 99-XJ-01</span>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-primary/40 bg-[#0f2317]/80 backdrop-blur-sm focus:border-primary h-14 placeholder:text-[#8ecca7] pl-4 pr-12 text-base font-medium leading-normal shadow-[0_0_10px_rgba(6,234,97,0.1)] transition-all uppercase"
                                placeholder="ENTER ROLE (e.g. UX DESIGNER)"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </label>
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-14 px-5 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all text-background-dark text-base font-bold leading-normal tracking-[0.1em] shadow-neon-green mt-2 group"
                    >
                        <span className={`material-symbols-outlined mr-2 ${loading ? 'animate-spin' : 'group-hover:animate-ping'}`}>radar</span>
                        <span className="truncate">{loading ? 'SCANNING...' : 'SCAN NETWORK'}</span>
                    </button>
                </div>
            </div>

            {/* Results Feed */}
            {skills && (
                <div className="relative z-10 flex-1 bg-background-dark/90 rounded-t-3xl border-t border-primary/20 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-24 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-between px-6 pt-6 pb-4">
                        <h3 className="text-white font-bold tracking-wider text-sm">DATA DECRYPTED: {Object.keys(skills).length} NODES</h3>
                        <div className="flex items-center gap-1">
                            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-[10px] text-primary font-mono">LIVE FEED</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 px-4 overflow-y-auto pb-8">
                        {Object.entries(skills).map(([skill, data], idx) => (
                            <div key={skill} className={`bg-background-void border ${data.priority === 'high' ? 'border-alert-red shadow-neon-red' : 'border-primary shadow-neon-green'} rounded-md p-4 relative overflow-hidden group`}>
                                <div className="absolute top-0 right-0 p-2 opacity-50">
                                    <span className={`material-symbols-outlined ${data.priority === 'high' ? 'text-alert-red' : 'text-primary'}`}>
                                        {data.priority === 'high' ? 'warning' : 'verified'}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className={`size-10 rounded flex items-center justify-center shrink-0 ${data.priority === 'high' ? 'bg-alert-red/10 border border-alert-red/30 text-alert-red' : 'bg-primary/10 border border-primary/30 text-primary'}`}>
                                        <span className="material-symbols-outlined">
                                            {data.priority === 'high' ? 'bolt' : 'psychology'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-white font-bold text-lg leading-tight uppercase">{skill}</h4>
                                            <span className={`font-mono text-xs font-bold border px-1 rounded ${data.priority === 'high' ? 'text-alert-red border-alert-red' : 'text-primary border-primary'}`}>
                                                {data.priority === 'high' ? 'CRITICAL' : 'STABLE'}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs mb-3">
                                            Demand frequency: {data.demand_percentage}%
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div className={`h-full w-[${data.demand_percentage}%] ${data.priority === 'high' ? 'bg-alert-red shadow-[0_0_10px_#ff2a2a]' : 'bg-primary shadow-[0_0_10px_#06ea61]'}`} style={{ width: `${data.demand_percentage}%` }}></div>
                                            </div>
                                            <span className={`font-mono text-xs ${data.priority === 'high' ? 'text-alert-red' : 'text-primary'}`}>{data.demand_percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobMarket;
