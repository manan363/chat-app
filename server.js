import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import config from './config';
import { checkUser } from './middleware/authMiddleware';
import defaultRouter from './routes';
import authRouter from './routes/authRoutes';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('*', checkUser);

app.use(defaultRouter);

app.use(express.static('public'));
app.use(express.json());

app.use(authRouter);

mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(server.listen(config.port, () => {
        console.info(`App Running on http://localhost:${config.port}`);
    }))
    .catch((err) => console.error(err));

io.on('connection', (socket) => {
    // io.emit() -> for all clients when a connection happens
    // socket.emit() -> for that particular socket connection
    // socket.broadcast.emit() -> all other clients apart from that socket connection
    console.log('a user connected');

    // emits a message to the client who has newly joined a chat (only to that client)
    socket.emit('message', 'Welcome to Chat App!');

    // broadcast.emits a message to all other clients when a client joins a chat (apart from the joining client)
    socket.broadcast.emit('message', 'A new user has joined a chat');

    socket.on('message', (msg) => {
        console.log(msg);
    });

    // runs when a client disconnects.
    socket.on('disconnect', () => {
        io.emit('message', 'a user has disconnected');
        console.log('a user disconnected');
    });
});
