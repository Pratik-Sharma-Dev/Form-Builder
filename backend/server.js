require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const questionsRoutes = require('./routes/questions');
const responsesRoutes = require('./routes/responses');
const path = require('path');

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

module.exports = connectDB;



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"../frontend/dist")));

// Routes
// app.get("/",(req, res) => {
//     res.send("Welcome to backend of form builder");
// })

app.use('/api/questions', questionsRoutes);
app.use('/api/responses', responsesRoutes);

// 404 Error Handler
// app.use('*', (req, res) => {
//   res.status(404).send('Error: Route not found');
// });

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

