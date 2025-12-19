// frontend/src/components/FlashcardManager.jsx
import React, { useState, useEffect } from 'react';
import { flashcardService } from '../services/flashcardService';
import './FlashcardManager.css'; // 

const FlashcardManager = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [flippedId, setFlippedId] = useState(null);
    
    // Form State
    const [newCard, setNewCard] = useState({
        question: '', answer: '', category: 'General', difficulty: 'Medium'
    });

    // Fetch Data
    const fetchData = async () => {
        try {
            const [cardsData, statsData] = await Promise.all([
                flashcardService.getAll(),
                flashcardService.getStats()
            ]);
            setFlashcards(cardsData);
            setStats(statsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await flashcardService.create(newCard);
            setNewCard({ question: '', answer: '', category: 'General', difficulty: 'Medium' });
            fetchData(); // Refresh list
        } catch (error) {
            alert("Failed to create card");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this card?")) return;
        try {
            await flashcardService.delete(id);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">📚 Flashcard Manager</h1>
            
            {/* Stats Bar */}
            {stats && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Total Cards</p>
                        <p className="text-2xl font-bold">{stats.total_flashcards}</p>
                    </div>
                    {/* Add more stats here if needed */}
                </div>
            )}

            {/* Create Form */}
            <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Create New Card</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        placeholder="Question" 
                        className="p-2 border rounded"
                        value={newCard.question}
                        onChange={(e) => setNewCard({...newCard, question: e.target.value})}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Answer" 
                        className="p-2 border rounded"
                        value={newCard.answer}
                        onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
                        required
                    />
                    <select 
                        className="p-2 border rounded"
                        value={newCard.difficulty}
                        onChange={(e) => setNewCard({...newCard, difficulty: e.target.value})}
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder="Category (e.g. React)" 
                        className="p-2 border rounded"
                        value={newCard.category}
                        onChange={(e) => setNewCard({...newCard, category: e.target.value})}
                    />
                </div>
                <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add Flashcard
                </button>
            </form>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                    <div 
                        key={card.id} 
                        className="relative h-64 w-full cursor-pointer perspective-1000"
                        onClick={() => setFlippedId(flippedId === card.id ? null : card.id)}
                    >
                        <div className={`relative h-full w-full transition-transform duration-500 transform-style-3d ${flippedId === card.id ? 'rotate-y-180' : ''}`}>
                            
                            {/* Front */}
                            <div className="absolute inset-0 bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100 backface-hidden flex flex-col justify-between">
                                <div>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 
                                        ${card.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                                          card.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {card.difficulty}
                                    </span>
                                    <h3 className="text-xl font-medium text-gray-800">{card.question}</h3>
                                </div>
                                <div className="text-gray-400 text-sm text-center mt-4">Click to flip</div>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 bg-indigo-50 p-6 rounded-xl shadow-lg border-2 border-indigo-100 backface-hidden rotate-y-180 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg text-gray-700">{card.answer}</h3>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm text-indigo-500 font-semibold">{card.category}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashcardManager;
