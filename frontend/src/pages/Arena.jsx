import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import api from '../services/api';
import confetti from 'canvas-confetti';

const Arena = () => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [complete, setComplete] = useState(false);
    const { addXp } = useGame();

    useEffect(() => {
        const fetchCards = async () => {
            const userId = 1;
            try {
                const res = await api.getDueFlashcards(userId);
                setCards(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCards();
    }, []);

    const handleReview = async (quality) => {
        const card = cards[currentIndex];
        await api.reviewFlashcard(card.id, quality);

        if (quality >= 4) {
            addXp(20 + quality, 'CRITICAL HIT');
            if (quality === 5) {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#06ea61', '#00f3ff'] });
            }
        } else {
            addXp(5, 'Hit');
        }

        setTimeout(() => {
            setRevealed(false);
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setComplete(true);
                addXp(200, 'MISSION COMPLETE');
                confetti({ particleCount: 200, spread: 100 });
            }
        }, 200);
    };

    if (complete) {
        return (
            <div className="h-screen w-full max-w-md mx-auto bg-background-dark flex flex-col items-center justify-center text-center p-8">
                <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-primary text-6xl">emoji_events</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">MISSION ACCOMPLISHED</h2>
                <p className="text-gray-400">All targets neutralized.</p>
            </div>
        );
    }

    if (cards.length === 0) return (
        <div className="h-screen w-full max-w-md mx-auto bg-background-dark flex items-center justify-center text-gray-400">
            No targets detected.
        </div>
    );

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
        <div className="relative flex h-screen w-full max-w-md mx-auto flex-col overflow-y-auto no-scrollbar shadow-2xl bg-background-light dark:bg-background-dark font-display text-white selection:bg-primary selection:text-background-dark">
            {/* TopAppBar */}
            <header className="sticky top-0 z-20 flex items-center bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-white/5">
                <button className="text-white hover:text-primary transition-colors flex size-10 shrink-0 items-center justify-center rounded-full active:bg-white/5">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center truncate px-2">
                    LEVEL 4: PYTHON BASICS
                </h2>
                <button className="flex items-center justify-center size-10 rounded-full active:bg-white/5">
                    <span className="material-symbols-outlined text-[#8ecca7] text-[24px]">pause</span>
                </button>
            </header>

            {/* HP Bar */}
            <div className="flex flex-col gap-2 px-4 py-3 z-10 w-full">
                <div className="flex gap-6 justify-between items-end">
                    <p className="text-white text-sm font-bold uppercase tracking-widest leading-none flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                        Battle HP
                    </p>
                    <p className="text-[#8ecca7] text-xs font-bold font-mono leading-none tracking-wider">{currentIndex + 1}/{cards.length} ENEMIES</p>
                </div>
                <div className="h-4 w-full rounded-full bg-[#1a3b2b] border border-[#2f6a47] relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#04a846] to-primary rounded-full shadow-[0_0_15px_rgba(6,234,97,0.6)] transition-all duration-500"
                        style={{ width: `${progress}%` }}>
                        <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/50 blur-[1px]"></div>
                    </div>
                </div>
            </div>

            {/* HUD Stats */}
            <div className="px-4 pb-2 z-10 w-full">
                <div className="flex items-center justify-center gap-4 py-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-orange-400 text-[20px]">local_fire_department</span>
                        <span className="text-orange-400 font-bold text-lg tracking-tight">COMBO: 5x</span>
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                        <span className="text-primary font-bold text-lg tracking-tight">XP: +150</span>
                    </div>
                </div>
            </div>

            {/* Main Card Area */}
            <main className="flex-1 flex flex-col p-4 w-full relative z-0 justify-center min-h-0">
                <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden border-2 border-primary shadow-neon bg-[#152e22] group/card transition-all duration-300"
                    onClick={() => setRevealed(true)}>

                    {/* Card Visual Header */}
                    <div className="h-32 w-full bg-cover bg-center relative shrink-0"
                        style={{ backgroundImage: 'linear-gradient(180deg, rgba(15, 35, 23, 0) 0%, rgba(21, 46, 34, 1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBSGFu1eH1lHpTIUBOIOXiYPLh7aCzkslWnBUxeiS84krLNeQQDs6nu6L1Be_8Ov2wsO3Lgl8Y_ZtIFcz9nB4chPplrYBvBjk-tVj8EOojk3W3ACNN7E9DnxMfNMRR-Uj4w3CdYkq80nWzV82BgDjmXW_MoxWUEtrNJ5TyZO3dpu94V9VmvYru-ghlYtjVwE07ubof394LfiRfuVXl-LQzbJeNDN01H4jhs7hmIY5CRwI_s9wzcsKVqPoX9frVZFCXz1ahfScM8adVt")' }}>
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-primary border border-primary/30">
                            #CATEGORY
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto relative no-scrollbar">
                        <div className="flex flex-col gap-2 mb-6 border-b border-white/10 pb-4">
                            <p className="text-[#8ecca7] text-xs font-bold uppercase tracking-widest mb-1">Objective</p>
                            <h3 className="text-white text-xl font-medium leading-tight">{currentCard.question}</h3>
                        </div>

                        {revealed ? (
                            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary text-[20px]">key</span>
                                    <p className="text-primary text-sm font-bold uppercase tracking-widest">Answer Decrypted</p>
                                </div>
                                <div className="text-white text-2xl font-bold leading-snug">
                                    {currentCard.answer}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center flex-1 opacity-50">
                                <span className="text-primary/50 text-sm animate-pulse">TAP TO DECRYPT</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Action Controls */}
            {revealed && (
                <div className="w-full p-4 pt-2 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20 animate-in slide-in-from-bottom-full duration-300">
                    <div className="flex flex-col gap-3">
                        <p className="text-center text-[#8ecca7] text-xs font-medium uppercase tracking-widest opacity-80 mb-1">Select Battle Rating</p>
                        <div className="grid grid-cols-4 gap-3 h-16">
                            <button onClick={() => handleReview(1)} className="flex flex-col items-center justify-center rounded-lg bg-red-900/20 border border-red-500/50 hover:bg-red-500/20 active:scale-95 transition-all group">
                                <span className="text-xs font-bold text-red-400 mb-0.5 group-hover:text-red-300">AGAIN</span>
                                <span className="text-[10px] text-red-400/60 font-mono group-hover:text-red-300/80">&lt;1m</span>
                            </button>
                            <button onClick={() => handleReview(3)} className="flex flex-col items-center justify-center rounded-lg bg-orange-900/20 border border-orange-500/50 hover:bg-orange-500/20 active:scale-95 transition-all group">
                                <span className="text-xs font-bold text-orange-400 mb-0.5 group-hover:text-orange-300">HARD</span>
                                <span className="text-[10px] text-orange-400/60 font-mono group-hover:text-orange-300/80">2d</span>
                            </button>
                            <button onClick={() => handleReview(4)} className="flex flex-col items-center justify-center rounded-lg bg-blue-900/20 border border-blue-500/50 hover:bg-blue-500/20 active:scale-95 transition-all group">
                                <span className="text-xs font-bold text-blue-400 mb-0.5 group-hover:text-blue-300">GOOD</span>
                                <span className="text-[10px] text-blue-400/60 font-mono group-hover:text-blue-300/80">4d</span>
                            </button>
                            <button onClick={() => handleReview(5)} className="flex flex-col items-center justify-center rounded-lg bg-primary/20 border border-primary hover:bg-primary/30 active:scale-95 transition-all shadow-neon group relative overflow-hidden">
                                <span className="text-xs font-bold text-primary mb-0.5 group-hover:text-white relative z-10">EASY</span>
                                <span className="text-[10px] text-primary/70 font-mono group-hover:text-white/80 relative z-10">7d</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(6, 234, 97, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 234, 97, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
                }}></div>
        </div>
    );
};

export default Arena;
