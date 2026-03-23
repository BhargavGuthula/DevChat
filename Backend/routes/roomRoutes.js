import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createRoom,
  getRoomMessages,
  getRooms,
  sendRoomMessage,
} from '../controllers/roomController.js';

const router = express.Router();

router.route('/').get(protect, getRooms).post(protect, createRoom);
router.get('/:id/messages', protect, getRoomMessages);
router.post('/:id/messages', protect, sendRoomMessage);

export default router;

