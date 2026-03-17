const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// Create booking
router.post('/', async (req, res) => {
  try {
    const { name, email, room_type, check_in, check_out, amount } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        name,
        email,
        room_type,
        check_in,
        check_out,
        amount,
        payment_status: 'pending'
      }]);

    if (error) throw error;

    res.status(201).json({
      message: 'Booking created',
      booking: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;