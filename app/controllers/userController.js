const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { registerSchema, loginSchema } = require('../validation/userValidation');
const { findUserByEmail, findUserById,createUser, updateSessionToken, generateHash } = require('../models/userModel');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_key';

// User registration
async function register(req, res) {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const existing = await findUserByEmail(value.email);
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const { first_name, last_name, email, password } = value;
        const newUser = await createUser(first_name, last_name, email, password);
        res.status(201).json({ user_id: newUser.user_id, email: newUser.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
}

// User login
async function login(req, res) {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await findUserByEmail(value.email);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const hash = generateHash(value.password, user.salt);
        if (hash !== user.password) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '2h' });
        await updateSessionToken(user.user_id, token);

        res.json({ message: 'Login successful', token, 
            user: { user_id: user.user_id, 
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email } });

        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
}

// User logout
async function logout(req, res) {
    try {
        const userId = req.user.user_id;
        await updateSessionToken(userId, null);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Logout error' });
    }
}

// Get user profile
async function getProfile(req, res) {
    res.json({ message: `Welcome user ${req.user.user_id}` });
}

// Get specific user by ID
async function getUserById(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Never return sensitive fields
        const { password, salt, session_token, ...safeUser } = user;

        res.json(safeUser);

    } catch (err) {
        console.error('GET USER BY ID ERROR:', err);
        res.status(500).json({ message: "Error fetching user" });
    }
}

// Export functions
module.exports = { register, login, logout, getProfile, getUserById };
