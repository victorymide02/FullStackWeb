import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validation/userValidation.js";
import { findUserByEmail, createUser } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function register(req, res) {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const existing = await findUserByEmail(value.email);
    if (existing) {
        return res.status(409).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(value.password, 10);
    const user = await createUser(value.email, hash);
    res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req, res) {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await findUserByEmail(value.email);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(value.password, user.password_hash);
    if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
}

export function logout(req, res) {
    // Client-side will simply delete token; here we just respond.
    res.json({ message: "Logged out successfully" });
}
