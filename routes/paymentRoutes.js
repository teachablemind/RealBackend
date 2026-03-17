const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('../config/supabaseClient');

// Initialize Payment
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, booking_id } = req.body;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Paystack uses kobo
        metadata: {
          booking_id
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.sk_test_41e5f44b96e9787e677f871839e79bf885fc1b2d}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Verify Payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.sk_test_41e5f44b96e9787e677f871839e79bf885fc1b2d}`
        }
      }
    );

    const data = response.data.data;

    if (data.status === 'success') {
      const booking_id = data.metadata.booking_id;

      // Update booking status
      await supabase
        .from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', booking_id);
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;