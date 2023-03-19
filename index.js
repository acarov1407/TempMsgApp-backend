import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { corsOptions } from "./cors/config.js";
import { Server } from "socket.io";
import { startConnection } from "./socket/events.js";

const app = express();
app.use(express.json());
dotenv.config();

app.use(cors(corsOptions));


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log('Servidor iniciado en el puerto ', PORT);
});

//Socket.io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
});

startConnection(io);