from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.flashcard import Flashcard
from app.services.spaced_repetition import SM2SpacedRepetition

router = APIRouter(prefix="/api/flashcards", tags=["flashcards"])
sm2 = SM2SpacedRepetition()

@router.get("/due/{user_id}")
def get_due_flashcards(user_id: int, db: Session = Depends(get_db)):
    """Get all flashcards due for review with retention predictions"""
    now = datetime.utcnow()
    due_cards = db.query(Flashcard).filter(
        Flashcard.user_id == user_id,
        Flashcard.next_review <= now
    ).all()
    
    cards_with_retention = []
    for card in due_cards:
        days_since = (now - card.last_reviewed).days if card.last_reviewed else 0
        retention = sm2.predict_retention(days_since, card.easiness_factor)
        
        cards_with_retention.append({
            "id": card.id,
            "question": card.question,
            "answer": card.answer,
            "predicted_retention": retention,
            "days_overdue": max(0, days_since - card.interval)
        })
    
    return cards_with_retention

@router.post("/{card_id}/review")
def review_flashcard(card_id: int, quality: int, db: Session = Depends(get_db)):
    """Review a flashcard and calculate next review date using SM-2"""
    if quality < 0 or quality > 5:
        raise HTTPException(status_code=400, detail="Quality must be 0-5")
    
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    
    # Calculate next review using SM-2
    new_reps, new_ef, new_interval, next_review = sm2.calculate_next_review(
        quality=quality,
        repetitions=card.repetitions,
        easiness_factor=card.easiness_factor,
        interval=card.interval
    )
    
    # Update card
    card.repetitions = new_reps
    card.easiness_factor = new_ef
    card.interval = new_interval
    card.next_review = next_review
    card.last_reviewed = datetime.utcnow()
    
    db.commit()
    
    return {
        "message": "Review recorded",
        "next_review": next_review.isoformat(),
        "interval_days": new_interval,
        "new_easiness_factor": new_ef
    }
