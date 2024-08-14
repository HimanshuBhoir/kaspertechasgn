const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }));
  app.use(express.json());

const uri= 'mongodb+srv://himbr:himbr@cluster0.frv4w5t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
async function connectDB() {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  }
  
  connectDB();

  const gridSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    grid: {
      type: [Number],
      required: true,
    },
    cutNumbers: {
      type: [Number],
      default: []
    },
    isWinner: {
      type: Boolean,
      default: false
    }
  });

  const Grid = mongoose.model('Grid', gridSchema);

//   async function createDefaultUsers() {
//     try {
//       const userA = new Grid({ userId: 'userA', grid: Array(9).fill(null) });
//       const userB = new Grid({ userId: 'userB', grid: Array(9).fill(null) });
  
//       await Grid.create([userA, userB]);
//       console.log('Default users created');
//     } catch (error) {
//       console.log('Default users already exist or there was an error:', error.message);
//     }
//   }
  
//   createDefaultUsers();

  app.put('/api/updategrid', async (req, res) => {
    const { userId, grid } = req.body;
  
    try {
      const updatedGrid = await Grid.findOneAndUpdate(
        { userId },
        { grid, cutNumbers: [] },
        { new: true }
      );
      res.json(updatedGrid);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.put('/api/cutnumber', async (req, res) => {
    const { number } = req.body;
  
    try {
      const users = await Grid.find({});
      let winnerId = null;
  
      for (let user of users) {
        console.log(user)
        if (!user.cutNumbers.includes(number)) {
          user.cutNumbers.push(number);
        }
        const hasWon = checkWin(user.grid, user.cutNumbers);
        user.isWinner = hasWon;
  
        await user.save();
        
        if (hasWon) {
          winnerId = user.userId;
          break;
        }
      }
  
      if (winnerId) {
        res.json({ winner: true, userId: winnerId });
      } else {
        res.json({ winner: false });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  function checkWin(grid, cutNumbers) {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];
  
    for (const line of winningLines) {
        if (line.every(index => cutNumbers.includes(grid[index]))) {
          return true;
        }
      }
      
      return false;
  }

  
app.listen(PORT, () => {
  console.log(`Server is running`);
});
