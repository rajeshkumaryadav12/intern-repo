const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, fullName, gender, dateOfBirth, country } = req.body;

        if (!username || !email || !password || !fullName || !gender || !dateOfBirth || !country) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            gender,
            dateOfBirth,
            country,
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Registration Error:", error.message);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Query is required." });
        }

        const regexQuery = new RegExp(`^${query}$`, "i");

        const user = await User.findOne({
            $or: [
                { username: { $regex: regexQuery } },
                { email: { $regex: regexQuery } },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.json({
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            country: user.country,
        });
    } catch (error) {
        console.error("Search User Error:", error.message);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.json(user);
    } catch (error) {
        console.error("Get User Info Error:", error.message);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};
