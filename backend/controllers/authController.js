const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ User Registration
exports.registerUser = async (req, res) => {
    try {
        console.log("📩 Received Data:", req.body);  // ✅ Log incoming request for debugging

        const { username, email, password, fullName, gender, dateOfBirth, country } = req.body;

        if (!username || !email || !password || !fullName || !gender || !dateOfBirth || !country) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use." });

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
        console.error("❌ Registration Error:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ✅ User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        try {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (jwtError) {
            console.error("JWT Error:", jwtError);
            return res.status(500).json({ message: "Token generation failed." });
        }

    } catch (error) {
        console.error("❌ Login Error:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};


exports.searchUser = async (req, res) => {
  try {
      const { query } = req.query;
      if (!query) return res.status(400).json({ message: "Query is required." });

      // Convert query to lowercase for case-insensitive search
      const lowerCaseQuery = query.toLowerCase();

      // Check if query is an exact match for either username or email (case-insensitive)
      const user = await User.findOne({
          $or: [
              { username: { $regex: new RegExp(`^${lowerCaseQuery}$`, "i") } }, // Exact username match (case-insensitive)
              { email: { $regex: new RegExp(`^${lowerCaseQuery}$`, "i") } } // Exact email match (case-insensitive)
          ]
      });

      if (!user) return res.status(404).json({ message: "User not found." });

      res.json({
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          country: user.country
      });

  } catch (error) {
      res.status(500).json({ message: "Server error." });
  }
};


// ✅ Get Logged-in User Info (Dashboard)
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });

        return res.json(user);
    } catch (error) {
        console.error("❌ Fetch User Error:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};
