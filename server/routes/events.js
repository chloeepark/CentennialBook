import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

export default router;
