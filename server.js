const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-list', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Grocery List Schema
const groceryListSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    items: [String]
});

const GroceryList = mongoose.model('GroceryList', groceryListSchema);

// Routes
app.post('/api/grocery-lists', async (req, res) => {
    try {
        const { items } = req.body;
        const newList = new GroceryList({ items });
        await newList.save();
        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/grocery-lists', async (req, res) => {
    try {
        const lists = await GroceryList.find().sort({ date: -1 });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/grocery-lists/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const lists = await GroceryList.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 