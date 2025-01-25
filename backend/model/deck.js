import mongoose from "mongoose";

const {Schema} = mongoose

const cardSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

const deckSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    cards: [cardSchema]
})

export default mongoose.model('Deck',deckSchema);