import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FlashcardReviewer.css';

const FlashcardReviewer = ({ userId = 1 }) => { // Hardcode user 1 for demo
    const [dueCards, setDueCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchDueCards = async () => {
            try {
                const response = await api.getDueFlashcards(userId);
                setDueCards(response.data);
            } catch (error) {
                console.error("Failed to fetch due cards:", error);
            }
        };
        fetchDueCards();
    }, [userId]);

    const handleReview = async (quality) => {
        const card = dueCards[currentCardIndex];
        try {
            const response = await api.reviewFlashcard(card.id, quality);
            setFeedback(`Review recorded! Next review in ${response.data.interval_days} days.`);

            // Move to next card
            setShowAnswer(false);
            setTimeout(() => {
                setFeedback('');
                setCurrentCardIndex(prev => prev + 1);
            }, 2000);
        } catch (error) {
            console.error("Failed to submit review:", error);
        }
    };

    if (dueCards.length === 0) return <p>No flashcards due for review today. Great job!</p>;
    if (currentCardIndex >= dueCards.length) return <p>All done for today! You're a rockstar!</p>;

    const card = dueCards[currentCardIndex];

    return (
        <div className="flashcard-container">
            <div className={`card-face ${showAnswer ? 'flipped' : ''}`}>
                <div className="face front">{card.question}</div>
                <div className="face back">{card.answer}</div>
            </div>

            {feedback && <p className="feedback-message">{feedback}</p>}

            {!showAnswer && <button onClick={() => setShowAnswer(true)}>Show Answer</button>}

            {showAnswer && !feedback && (
                <div className="quality-buttons">
                    <p>How well did you know this?</p>
                    <button onClick={() => handleReview(1)}>Hard</button>
                    <button onClick={() => handleReview(3)}>Good</button>
                    <button onClick={() => handleReview(5)}>Easy</button>
                </div>
            )}
        </div>
    );
};

export default FlashcardReviewer;
