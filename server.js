const express = require('express');
const app = express();

app.use(express.json());

app.post('/findRide', (req, res) => {
  const { pickupLocation, dropoffLocation } = req.body;
  console.log("it works")

  // Check if both parameters are provided.
  if (!pickupLocation || !dropoffLocation) {
    return res.status(400).json({ error: 'Both pickupLocation and dropoffLocation are required.' });
  }

  // You can add your logic here to calculate the cost based on the pickup and dropoff locations.
  // In this case, we're returning a static cost.
  const rideCost = 21;

  res.json({ rideCost });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
