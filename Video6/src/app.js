import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Some important configurations

// why we're using cors? 
// CORS is used to allow or restrict resources on a web server to be requested from another domain outside the domain from which the first resource was served.
// This is important for security reasons, as it prevents unauthorized access to resources.
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
})); 

// why we're using express.json()?
// express.json() is a built-in middleware function in Express that parses incoming requests with JSON payloads and is based on the body-parser library.
// It is used to parse the JSON data sent in the request body and make it available under req.body.
app.use(express.json({limit: '10mb'}))

// what will happen if data is sent in the form of urlencoded?
// express.urlencoded() is a built-in middleware function in Express that parses incoming requests with urlencoded payloads.
// It is used to parse the URL-encoded data sent in the request body and make it available under req.body.
app.use(express.urlencoded({extended :true, limit: '10mb'}));

// what about the images, files, etc?
// express.static() is a built-in middleware function in Express that serves static files such as images, CSS files, and JavaScript files.
app.use(express.static('public')); // why we're using public folder? 
// The public folder is used to serve static assets to the client. By placing all static files in this folder, we can easily manage and serve them without having to define separate routes for each file.
 
// why we're using cookie-parser?
//we use cookie-parser to access cookies of user's browser & set cookies in user's browser.
app.use(cookieParser());
export { app };