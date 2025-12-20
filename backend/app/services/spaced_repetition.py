from datetime import datetime, timedelta
from typing import Tuple
import math

class SM2SpacedRepetition:
    """
    SuperMemo 2 (SM-2) Algorithm Implementation
    Quality scale (0-5):
    0: Complete blackout
    1: Incorrect, but familiar
    2: Incorrect, easy to recall
    3: Correct with difficulty
    4: Correct with hesitation
    5: Perfect response
    """
    
    @staticmethod
    def calculate_next_review(
        quality: int,  # 0-5 rating
        repetitions: int,  # Number of times reviewed
        easiness_factor: float,  # Current EF (starts at 2.5)
        interval: int  # Current interval in days
    ) -> Tuple[int, float, int, datetime]:
        """
        Returns: (new_repetitions, new_ef, new_interval, next_review_date)
        """
        
        # Update easiness factor
        new_ef = easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        
        # EF should not fall below 1.3
        if new_ef < 1.3:
            new_ef = 1.3
        
        # If quality < 3, restart from beginning
        if quality < 3:
            new_repetitions = 0
            new_interval = 1
        else:
            new_repetitions = repetitions + 1
            
            # Calculate new interval
            if new_repetitions == 1:
                new_interval = 1
            elif new_repetitions == 2:
                new_interval = 6
            else:
                new_interval = round(interval * new_ef)
        
        # Calculate next review date
        next_review = datetime.utcnow() + timedelta(days=new_interval)
        
        return new_repetitions, round(new_ef, 2), new_interval, next_review
    
    @staticmethod
    def predict_retention(days_since_review: int, easiness_factor: float) -> float:
        """
        Predict probability of remembering (forgetting curve)
        Returns: retention probability (0.0 to 1.0)
        """
        decay_rate = 0.1 * (2.5 - easiness_factor)  # Lower EF = faster forgetting
        retention = math.exp(-decay_rate * days_since_review)
        return round(retention, 2)
