const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB Error:', err));

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, default: 'No Subject' },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email & message are required.' });
    }

    const newMsg = new Message({ name, email, subject, message });
    await newMsg.save();

    console.log('New message from:', name, email);
    res.status(201).json({ success: true, message: 'Message saved!' });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.get('/api/messages', async (req, res) => {
  const messages = await Message.find().sort({ sentAt: -1 });
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});