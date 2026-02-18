// Importing modules
import sql from './config/db.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    const username = socket.handshake.auth.username;
    socket.username = username;
    console.log(username + " connected");

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.username);
    });
    socket.on('send-message', message=>{
        socket.broadcast.emit('chat-message', {username: socket.username, message: message});
    });
    
});

async function checkConnection() {
    try {
        const result = await sql`SELECT 1+1 AS result`;
        console.log('✅ Connected to PostgreSQL. Test query result:', result[0].result);
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
}

checkConnection();

app.get("/", (req, res) => { 
    res.send("express server"); 
});

app.get("/hello", (req, res) => { 
    res.send("hello response"); 
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
