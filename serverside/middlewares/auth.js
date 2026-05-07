import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  // Get token from cookies first, fallback to Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token, authentication denied." });

 try {
    // 2. Verify the token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the user data (id and role) to the request object
    // This is what permit() in your roles.js uses!
    req.user = decoded; 
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
