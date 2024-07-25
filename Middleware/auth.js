import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../model/userSchema/user.schema.js";

dotenv.config();

const authenticatedUser = async (request, response, next) => {
    const token = request.cookies.token || request.headers.authorization?.split(' ')[1];
    if (!token) {
        return response.status(401).json({ message: "Token is missing" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        request.userId = decodedToken.id;
        const user = await User.findById(request.userId);

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        request.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({ message: "Token has expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return response.status(401).json({ message: "Invalid token" });
        }
        response.status(500).json({ message: "Internal server error" });
    }
};

export default authenticatedUser;
