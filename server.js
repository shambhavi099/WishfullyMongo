const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const User = require("./models/user"); // Import the User model
const authRoutes = require('./routes/authRoutes'); // Ensure this path is correct

dotenv.config(); // Load environment variables

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Middleware
app.use(express.json());
app.use(cors());

// 📌 MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 📌 Registration Route
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Login Route (✅ Add this here, below register route)
app.post("/login", async (req, res) => {
    console.log("🔹 Login route hit!");
    
    try {
        const { email, password } = req.body;
        console.log("Received Data:", { email, password });

        if (!email || !password) {
            console.log("❌ Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        console.log("🔍 User found:", user);

        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔍 Password match:", isMatch);

        if (!isMatch) {
            console.log("❌ Invalid credentials");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("✅ Login successful");
        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// 📌 Routes
app.use('/api/auth', authRoutes);

// 📌 Test Route
app.get('/', (req, res) => {
    res.send('Server is running successfully!');
});

// 📌 Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
