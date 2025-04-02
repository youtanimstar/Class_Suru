import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import {
    createUser,
    findUserByEmail,
    findUserById,
    storeResetToken,
    getUserByResetToken,
    updateUserPassword,
    getAllUsers as getAllUsersModel,
    findAdminByEmail,
    verifyAdminOTP,
    addUserDetail,
    updateUserDetails
} from "../models/userModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRATION = "30d";

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const token = req.body.token || req.query.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

// Signup Route
const signup = async (req, res) => {
    try {
        const { username, email, password, phone_number } = req.body;
        if (!username || !email || !password ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(email, username, hashedPassword, phone_number);

        const token = generateToken(newUser);
        res.status(201).json({ success: true, message: "User registered successfully", userId: newUser.id, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Login Route
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(user);
        res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Forgot Password Route
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

        await storeResetToken(email, resetToken);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: `
            <div style="text-align: center;">
                <img src="https://class-suru.vercel.app/assets/class_suru_logo-wIYO1Yaf.png" alt="Banner" style="width: 100%; max-width: 200px;margin:0 auto;"/>
                <h2>Password Reset Request</h2>
                <p>Dear User,</p>
                <p>We received a request to reset your password. Click the link below to reset your password:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                <p>Thank you,</p>
                <p>Class Suru Team</p>
            </div>
            `,
        });

        res.json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Reset Password Route
const resetPassword = async (req, res) => {
    try {
        console.log('resetPassword');
        
        const { token } = req.query;
        const { newPassword } = req.body;

        console.log(token, newPassword);
        

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await getUserByResetToken(decoded.email, token);

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await updateUserPassword(user.email, hashedPassword);

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Invalid or expired token", error: error.message });
    }
};

// Fetch User Details Route
const getUserDetails = async (req, res) => {
    try {
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const { password, ...userDetails } = user;
        res.status(200).json({ success: true, user: userDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update User Details Route
const addUserInfo = async (req, res) => {
    try {
        const { userId, exam, userClass, favouriteSubject } = req.body;
        if (!userId || !exam || !userClass || !favouriteSubject) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const updatedUser = await addUserDetail(userId, exam, userClass, favouriteSubject);
        res.status(200).json({ success: true, message: "User details updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Protected Route Example
const protectedRoute = (req, res) => {
    res.json({ success: true, message: "This is a protected route", user: req.user });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersModel();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


const adminLogin = async (req,res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await findAdminByEmail(email);
        if (!user || password!== user.password) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        if(user.role !== 'Admin'){
            return res.status(401).json({ success: false, message: "Unauthorized: Only Admins can login" });
        }

        // const token = generateToken(user);
        res.status(200).json({ success: true, message: "Primary Checking successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

const checkAdminOtp = async (req,res)=>{
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const admin = await verifyAdminOTP(email,otp);
        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid email or otp" });
        }

        const token = generateToken(admin);
        res.status(200).json({ success: true, message: "Authorization Successful",token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const updates = req.body;
        const { id } = req.params;
        if (!updates) {
            return res.status(400).json({ success: false, message: "no fields to update" });
        }

        const updatedUser = await updateUserDetails(id, updates);
        res.status(200).json({ success: true, message: "User details updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

export { signup, login, verifyToken, protectedRoute, getUserDetails, addUserInfo, forgotPassword, resetPassword,getAllUsers,adminLogin,checkAdminOtp,updateUser };
