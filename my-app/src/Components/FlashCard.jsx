import React, { useState,useEffect } from "react";
import './ComponentCSS/FlashCard.css';

export default function Flashcard({ question, answer}) {
    
    const [flip, setflip] = useState(false);
    
    const handleFlip = () => {
        setflip(!flip);
    };
    useEffect(() => {
        setflip(false);
    }, [question, answer]);
    
    return (
        <div className={`flashcard ${flip ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flashcard-inner">
                <div className="flashcard-front">
                    <h3>Question:</h3>
                    <p>{question}</p>
                </div>
                <div className="flashcard-back">
                    <h4>Answer:</h4>
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
}
