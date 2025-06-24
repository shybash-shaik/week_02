const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const { swaggerSpec, swaggerUi } = require('./swagger');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send('Cheat Buster API is running!');
});

app.use('/api', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
