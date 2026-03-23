import Room from '../models/room.js';
import Message from '../models/message.js';
import sanitizeHtml from 'sanitize-html';
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('createdBy', 'username email')
      .sort({ createdAt: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRoom = async (req, res) => {
  const { name, description } = req.body;
  try {
    const trimmedName = sanitizeHtml(name?.trim());
    const trimmedDescription = sanitizeHtml(description?.trim()) || '';

    if (!trimmedName) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    const exists = await Room.findOne({ name: trimmedName });
    if (exists) return res.status(400).json({ message: 'Room already exists' });

    const room = await Room.create({
      name: trimmedName,
      description: trimmedDescription,
      createdBy: req.user._id,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRoomMessages = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.id })
      .populate('sender', 'username')
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendRoomMessage = async (req, res) => {
  const { text } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const trimmedText = sanitizeHtml(text?.trim());

    if (!trimmedText) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const message = await Message.create({
      room: room._id,
      sender: req.user._id,
      text: trimmedText,
    });

    const populatedMessage = await message.populate('sender', 'username');

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getRooms, createRoom, getRoomMessages, sendRoomMessage };
