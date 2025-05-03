const express = require('express');
const app = express();
const productAnalysisRoutes = require('./routes/productAnalysisRoutes'); // Ensure correct path

// Use the product analysis routes
app.use('/api', productAnalysisRoutes);

// Default route for testing
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
