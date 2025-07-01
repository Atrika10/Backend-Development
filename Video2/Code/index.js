
import 'dotenv/config'; 
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/login', (req, res)=>{
    res.send("hellooooooo i'm sending data from the server");
})
app.listen(PORT, ()=>{
    console.log("server is working", PORT);
})  