const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    // ✅ Check if Authorization header exists
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ message: "Access Denied. No token provided." });
    }
    
    try {
        // ✅ Extract token if it's in the format "Bearer <token>"
        const tokenParts = token.split(" ");
        const actualToken = tokenParts.length === 2 ? tokenParts[1] : token;

        // ✅ Verify token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};
