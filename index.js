require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing
const employModel = require('./models/employs');


const app = express();
app.use(cors());
app.use(express.json());

const hostname = 'localhost';
const PORT =  3000;


const MONGODB_CONNECT_URI =   process.env.MONGO_URI;

mongoose.connect(MONGODB_CONNECT_URI , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

app.get('/', (req, res) => {
    res.send('Connected!');
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        
        const user = await employModel.findOne({ name });

        if (!user) {
            return res.send('Not exist');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.send('wrong password');
        }

        res.send('login');
    } catch (error) {
        console.error(error);
        res.send('Error ')
    }
});

app.post('/signup', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Check if the user already exists in the database
        const existingUser = await employModel.findOne({ name });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = new employModel({ name, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://${hostname}:${PORT}`);
});
