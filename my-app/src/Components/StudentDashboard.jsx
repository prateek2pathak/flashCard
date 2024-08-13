import React, { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./FlashCard.jsx";
import './ComponentCSS/StudentDashboard.css';

const client = axios.create({
    baseURL:  'https://flashcard-backend121.onrender.com/'
});

export default function StudentDashboard() {
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const fetchDecks = async () => {
        try {
            const response = await client.get('/decks');
            setDecks(response.data);
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    }

    useEffect(() => {
        fetchDecks();
    }, []);

    const handleDeckSelection = (e) => {
        const selectedDeck = decks.find(deck => deck._id === e.target.value);
        setSelectedDeck(selectedDeck);
        setCurrentCardIndex(0);
    }

    const goToNextCard = () => {
        setCurrentCardIndex((prevIndex) => 
            (prevIndex + 1) % selectedDeck.cards.length
        );
    }

    const goToPrevCard = () => {
        setCurrentCardIndex((prevIndex) => 
            (prevIndex - 1 + selectedDeck.cards.length) % selectedDeck.cards.length
        );
    }

    return (
        <div className="student-dashboard">
            <h1>Student Dashboard</h1>

            <h2>Select Deck</h2>
            <select onChange={handleDeckSelection}>
                <option value="">Select a deck</option>
                {decks.map(deck => (
                    <option key={deck._id} value={deck._id}>
                        {deck.name}
                    </option>
                ))}
            </select>

            {selectedDeck && selectedDeck.cards.length > 0 ? (
                <div className="flashcard-container">
                    <Flashcard 
                        question={selectedDeck.cards[currentCardIndex].question}
                        answer={selectedDeck.cards[currentCardIndex].answer
                        }
                        state={false}
                    />

                    <div className="navigation-buttons">
                        <button onClick={goToPrevCard}>Previous</button>
                        <button onClick={goToNextCard}>Next</button>
                    </div>
                </div>
            ) : (
                <p>Please select a deck to view flashcards.</p>
            )}
        </div>
    );
}
