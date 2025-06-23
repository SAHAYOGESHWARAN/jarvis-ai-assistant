import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret!@#$'; // Fallback for safety, ensure JWT_SECRET is in .env

if (process.env.JWT_SECRET === 'fallbackSecret!@#$' || !process.env.JWT_SECRET) {
    console.warn("Security Warning: JWT_SECRET is not set or using fallback. Please set a strong secret in your .env file.");
}

interface UserPayload {
    id: string; // Typically user ID from database
    username: string;
    // Add other relevant, non-sensitive user details
}

export const generateToken = (payload: UserPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

export const verifyToken = (token: string): UserPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid token or token expired:', error);
        return null;
    }
};
