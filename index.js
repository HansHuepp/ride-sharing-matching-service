const express = require('express');
const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/findRide', (req, res) => {
  const { pickupLocation, dropoffLocation } = req.body;
  console.log("it works")

  // Check if both parameters are provided.
  if (!pickupLocation || !dropoffLocation) {
    return res.status(400).json({ error: 'Both pickupLocation and dropoffLocation are required.' });
  }

  // You can add your logic here to calculate the cost based on the pickup and dropoff locations.
  // In this case, we're returning a static cost.
  const rideCost = 12;

  res.json({ rideCost });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
