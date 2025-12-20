import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(1);
    const [userLevel, setUserLevel] = useState(1);
    const [notifications, setNotifications] = useState([]);

    // Level calculations
    useEffect(() => {
        const newLevel = Math.floor(xp / 100) + 1;
        if (newLevel > userLevel) {
            setUserLevel(newLevel);
            addNotification(`LEVEL UP! You represent Level ${newLevel}`, 'levelup');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00f260', '#f80759', '#ffffff']
            });
        }
    }, [xp]);

    const addXp = (amount, reason) => {
        setXp(prev => prev + amount);
        addNotification(`+${amount} XP: ${reason}`, 'xp');
    };

    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        // Auto remove after 3s
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    return (
        <GameContext.Provider value={{
            xp,
            streak,
            userLevel,
            addXp,
            notifications
        }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-20 right-5 z-50 flex flex-col gap-2 pointer-events-none">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`
                            px-4 py-2 rounded-lg font-bold shadow-lg 
                            backdrop-blur-md border border-white/20
                            animate-in slide-in-from-right fade-in duration-300
                            ${n.type === 'levelup' ? 'bg-cyber-neonPink text-white text-xl' : 'bg-cyber-secondary/80 text-cyber-neonGreen'}
                        `}
                    >
                        {n.message}
                    </div>
                ))}
            </div>
        </GameContext.Provider>
    );
};
