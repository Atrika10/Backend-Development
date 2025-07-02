import express from 'express';
import 'dotenv/config'
const app = express();
const port = process.env.PORT || 3000;
const qoute = [
    {
        id: 1,
        text: 'The only limit to our realization of tomorrow is our doubts of today.'
    },
    {
        id: 2,
        text: 'The future belongs to those who believe in the beauty of their dreams.'
    },
    {
        id: 3,
        text: 'Do not wait to strike till the iron is hot, but make it hot by striking.'
    },
    {
        id: 4,
        text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.'
    },
    {
        id: 5,
        text: 'The best way to predict the future is to create it.'
    }
]
app.get('/quote', (req, res) => {
    res.send(qoute);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Visit http://localhost:${port}/quote to see the quote`);
})