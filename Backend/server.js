import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import Message from './models/message.js';
import sanitizeHtml from 'sanitize-html'; 
dotenv.config();
connectDB();

const app = express();
const clientUrl = '*';

app.use(cors({origin:'*'}));  

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => res.send('DevChat API running...'));

const server = http.createServer(app);

const io = new Server(server , {
  cors:{
    origin: '*',
    methods:['GET' , 'POST']
  }
})
io.on('connection' , (socket)=>{
  console.log('user Connected:' , socket.id);

  socket.on('join_room',({roomId , userId , username})=>{
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
  });

  socket.on('send_message' , async ({roomId ,userId , username , text})=>{
    try{
      const trimmedText = sanitizeHtml(text?.trim());

      if (!trimmedText) {
        return;
      }

      const message = await Message.create({
        room: roomId,
        sender: userId,
        text: trimmedText,
      });

      io.to(roomId).emit('receive_message' , {
        _id:message._id,
        text:message.text,
        sender:{_id:userId ,username},
        createdAt:message.createdAt,  
      });
    }catch(err){
        console.error('Message error:', err.message);
    }
  });
  socket.on('disconnect',()=>{
    console.log('User disconnected' , socket.id);
  });

});
server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
