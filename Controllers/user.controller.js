import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/userSchema/user.schema.js';

dotenv.config();

export const fetchUserDetails = async (request, response) => {
    try {
        const userId = request.userId;
        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        response.status(200).json({ message: "User data fetched successfully", user });
    } catch (error) {
        response.status(500).json({ message: "Failed to get user", error: error.message });
    }
}

export const signUpUser = async (request, response) => {
    try {
        const { name, email, password, confirmPassword } = request.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).json({ message: "User already exists" });
        }

        if (password !== confirmPassword || !password || !confirmPassword) {
            return response.status(400).json({ message: "Passwords do not match or are empty" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: '1d' // 1 day
        });

        response.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            secure: process.env.NODE_ENV === 'production',
        });

        await newUser.save();
        response.status(200).json({
            message: 'Register SuccessFul !',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
            }
        });


    } catch (error) {
        console.error("Error Sign up user:", error);
        response.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const signInUser = async(request, response)=>{
    try {
        const { email, password } = request.body;

        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return response.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d' // 1 day
        });
        
        response.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            secure: process.env.NODE_ENV === 'production',
        });

        response.status(200).json({ 
            message: 'Login Successful !', 
            token, 
            user: {
                id: user._id,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error Sign in user:", error);
        response.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const logoutUser = async (request, response) => {
    try {
        response.clearCookie('token');
        response.status(200).json({ message: 'User logged out' });
    } catch (error) {
        response.status(500).json({ message: "Failed to logout user", error: error.message });
    }
}