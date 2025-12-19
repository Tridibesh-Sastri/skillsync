from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.flashcard import Flashcard
from app.schemas.flashcard import FlashcardCreate, FlashcardUpdate, FlashcardResponse

router = APIRouter(prefix="/api/flashcards", tags=["flashcards"])

@router.post("/", response_model=FlashcardResponse, status_code=status.HTTP_201_CREATED)
def create_flashcard(
    flashcard: FlashcardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new flashcard for the authenticated user"""
    db_flashcard = Flashcard(
        **flashcard.dict(),
        user_id=current_user.id
    )
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

@router.get("/", response_model=List[FlashcardResponse])
def get_flashcards(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active flashcards for the authenticated user with optional filters"""
    query = db.query(Flashcard).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True
    )
    
    if category:
        query = query.filter(Flashcard.category == category)
    if difficulty:
        query = query.filter(Flashcard.difficulty == difficulty)
        
    flashcards = query.order_by(Flashcard.created_at.desc()).offset(skip).limit(limit).all()
    return flashcards

@router.get("/categories", response_model=List[str])
def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all unique categories for the user's flashcards"""
    categories = db.query(Flashcard.category).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True,
        Flashcard.category.isnot(None)
    ).distinct().all()
    return [cat[0] for cat in categories if cat[0]]

@router.get("/stats/summary")
def get_flashcard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get flashcard statistics for the user"""
    # Count total active flashcards
    total = db.query(func.count(Flashcard.id)).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True
    ).scalar() or 0

    # Count by difficulty
    by_difficulty = db.query(
        Flashcard.difficulty,
        func.count(Flashcard.id)
    ).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True
    ).group_by(Flashcard.difficulty).all()

    # Count by category
    by_category = db.query(
        Flashcard.category,
        func.count(Flashcard.id)
    ).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True,
        Flashcard.category.isnot(None)
    ).group_by(Flashcard.category).all()

    return {
        "total_flashcards": total,
        "by_difficulty": {diff: count for diff, count in by_difficulty},
        "by_category": {cat: count for cat, count in by_category if cat}
    }

@router.get("/{flashcard_id}", response_model=FlashcardResponse)
def get_flashcard(
    flashcard_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific flashcard by ID"""
    flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id,
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True
    ).first()
    
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    return flashcard

@router.put("/{flashcard_id}", response_model=FlashcardResponse)
def update_flashcard(
    flashcard_id: int,
    flashcard_update: FlashcardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing flashcard"""
    db_flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id,
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True
    ).first()
    
    if not db_flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    # Update only provided fields
    update_data = flashcard_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_flashcard, field, value)
    
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(
    flashcard_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Soft delete a flashcard (sets is_active to False)"""
    db_flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id,
        Flashcard.user_id == current_user.id,
        Flashcard.is_active == True
    ).first()
    
    if not db_flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    db_flashcard.is_active = False
    db.commit()
    return None
