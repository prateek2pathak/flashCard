import React, { useState, useEffect } from "react";
import axios from "axios";
import './ComponentCSS/Admin.css';

const client = axios.create({
    baseURL: 'https://flashcard-backend121.onrender.com/'
});
export default function AdminDashboard() {
    const [newDeckName, setNewDeckName] = useState("");
    const [newCardQuestion, setNewCardQuestion] = useState("");
    const [cardAnswer, setCardAnswer] = useState('');
    const [deckId, setDeckId] = useState("");
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);

    const fetchDecks = async () => {
        try {
            const response = await client.get('/decks');
            setDecks(response.data);
            if (deckId) {
                const selected = response.data.find(deck => deck._id === deckId);
                setSelectedDeck(selected);
            }
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    }

    const addDeck = async () => {
        try {
            await client.post('/decks', { name: newDeckName });
            setNewDeckName('');
            fetchDecks();
        } catch (error) {
            console.log('Error in adding decks ', error);
        }
    }

    const removeDeck = async () => {
        try {
            await client.delete(`/decks/${deckId}`);
            setDeckId('');
            setSelectedDeck(null);
            fetchDecks();
        } catch (error) {
            console.error('Error in removing deck', error);
        }
    }

    const addCard = async () => {
        try {
            await client.post(`/decks/${deckId}/cards`, { question: newCardQuestion, answer: cardAnswer });
            setNewCardQuestion('');
            setCardAnswer('');
            fetchDecks();
        } catch (error) {
            console.log('Error in adding card ', error);
        }
    }

    const removeCard = async (cardId) => {
        try {
            await client.delete(`/decks/${deckId}/cards/${cardId}`);
            fetchDecks();
        } catch (error) {
            console.error('Error removing card:', error);
        }
    };

    useEffect(() => {
        fetchDecks();
    }, []);

    useEffect(() => {
        if (deckId) {
            const selected = decks.find(deck => deck._id === deckId);
            setSelectedDeck(selected);
        }
    }, [deckId, decks]);

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <h2>Add Deck</h2>
            <input
                type="text"
                value={newDeckName}
                onChange={e => setNewDeckName(e.target.value)}
                placeholder="Deck Name"
            />
            <button onClick={addDeck}>Add Deck</button>

            <h2>Select Deck</h2>
            <select
                onChange={e => setDeckId(e.target.value)}
                value={deckId}
            >
                <option value="">Select Deck</option>
                {decks.map(deck => (
                    <option value={deck._id} key={deck._id}>
                        {deck.name}
                    </option>
                ))}
            </select>

            <h2>Add Card</h2>
            <input
                type="text"
                value={newCardQuestion}
                placeholder="Question?"
                onChange={e => setNewCardQuestion(e.target.value)}
            />
            <input
                type="text"
                value={cardAnswer}
                onChange={e => setCardAnswer(e.target.value)}
                placeholder="Type Answer!!"
            />
            <button onClick={addCard}>Add Card</button>
            <button onClick={removeDeck} id='removeDeck'>Remove Deck</button>

            <h2>Cards in Selected Deck</h2>
            {selectedDeck ? (
                <div>
                    {selectedDeck.cards.length > 0 ? (
                        <ul>
                            {selectedDeck.cards.map((card) => (
                                <li key={card._id}>
                                    <strong>Question:</strong> {card.question}<br />
                                    <strong>Answer:</strong> {card.answer}
                                    <button onClick={() => removeCard(card._id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No cards in this deck.</p>
                    )}
                </div>
            ) : (
                <p>Please select a deck to see its cards.</p>
            )}
        </div>
    );
}
