import express from 'express'
import cors from 'cors'
import database from './Database/db.js'
import Deck from './model/deck.js'
import UserSchema from './model/user.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const PORT = 4040;
const secret_key = "iamsecretkey"

const generateJWT = (email)=>{
    const payload = {
        email:email
    }
    return jwt.sign(payload,secret_key,{expiresIn:'1h'});
}


const app = express();
app.use(cors());

// parsing
app.use(express.json());
// connect to db
database();

app.post('/decks', async (req, res) => {
    try {
        const { name } = req.body;
        const deck = new Deck({ name,cards:[]});
        await deck.save();
        console.log('Deck added');
        res.status(201).send(deck);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

app.post('/register', async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const new_user = new UserSchema({name,email,password:hashedPassword,role});
        await new_user.save();
        console.log("User is added");
        const token = generateJWT(email);
        console.log("Token is generated");
        // Note we handle saving token part in the frontend part to keep the system decoupled

        res.status(200).json({
            success:true,
            new_user:new_user,
            jwtToken:token
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            success:false
        });
    }
})

app.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await UserSchema.findOne({email});
        if(!user){
            return res.status(402).json({
                success:false,
                message:"email id is not present"
            })
        }

        const compareHashedPassword = await bcrypt.compare(password,user.password);

        if(compareHashedPassword){
            const token = generateJWT(email);
            return res.status(200).json({
                success:true,
                message:"User logged in",
                jwtToken:token
            })
        }
        else{
            return res.status(402).json({
                success:false,
                message:"Password is wrong"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
})

app.get('/decks', async (req, res) => {
    try {
        const decks = await Deck.find();
        res.status(200).send(decks);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get('/decks/:id/cards', async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id);
        if (!deck) {
            return res.status(404).send({ error: 'Deck not found' });
        }
        res.status(200).send(deck.cards);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/decks/:id', async (req, res) => {
    try {
        const deck = await Deck.findByIdAndDelete(req.params.id);
        if (!deck) {
            return res.status(404).send({ error: 'Deck not found' });
        }
        res.status(200).send({ message: 'Deck deleted', deck });
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/decks/:id/cards', async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id);
        if (!deck) {
            return res.status(404).send({ error: 'Deck not found' });
        }

        const { question, answer } = req.body;
        deck.cards.push({ question, answer });

        await deck.save();
        res.status(201).send(deck);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.patch('/decks/:deckId/cards/:cardId', async (req, res) => {
    try {
        const { deckId, cardId } = req.params;
        const { question, answer } = req.body;

        const deck = await Deck.findById(deckId);
        if (!deck) {
            return res.status(404).send({ error: 'Deck not found' });
        }

        const card = deck.cards.id(cardId);
        if (!card) {
            return res.status(404).send({ error: 'Card not found' });
        }

        card.question = question || card.question;
        card.answer = answer || card.answer;

        await deck.save();
        res.status(200).send(deck);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/decks/:deckId/cards/:cardId', async (req, res) => {
    try {
        const { deckId, cardId } = req.params;
        const deck = await Deck.findById(deckId);
        if (!deck) {
            return res.status(404).send({ error: 'Deck not found' });
        }
        deck.cards = deck.cards.filter(card => card._id.toString() !== cardId);

        await deck.save();
        res.status(200).send({ message: 'Card deleted', deck });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});




app.listen(PORT, () => {
    console.log(`Server up and running on ${PORT}`);
})