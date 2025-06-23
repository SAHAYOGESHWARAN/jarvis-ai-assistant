import express, { Request, Response, Router } from 'express';
import { generateToken } from '../utils/authUtils';
import { protectRoute, AuthenticatedRequest } from '../middleware/authMiddleware';

const router: Router = express.Router();

// --- Mock User Store (Replace with Database interaction) ---
interface User {
    id: string;
    username: string;
    passwordHash: string; // In a real app, store hashed passwords
    email: string;
}
const users: User[] = []; // In-memory user store

// --- Registration (Placeholder) ---
router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    // Check if user already exists (mock)
    if (users.find(u => u.username === username || u.email === email)) {
        return res.status(409).json({ message: 'User already exists with this username or email.' });
    }

    // In a real app: hash password securely (e.g., with bcrypt)
    const passwordHash = `hashed_${password}`; // MOCK HASHING

    const newUser: User = {
        id: String(Date.now()), // Mock ID
        username,
        email,
        passwordHash,
    };
    users.push(newUser);
    console.log('Registered new user:', { id: newUser.id, username: newUser.username });

    // Optionally, generate a token upon registration
    const token = generateToken({ id: newUser.id, username: newUser.username });
    res.status(201).json({
        message: 'User registered successfully.',
        user: { id: newUser.id, username: newUser.username, email: newUser.email },
        token
    });
});

// --- Login (Placeholder) ---
router.post('/login', async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: 'Username/Email and password are required.' });
    }

    const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail));

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // In a real app: compare hashed password with bcrypt.compare()
    const isPasswordMatch = user.passwordHash === `hashed_${password}`; // MOCK PASSWORD CHECK

    if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken({ id: user.id, username: user.username });
    console.log('User logged in:', { id: user.id, username: user.username });

    res.json({
        message: 'Login successful.',
        user: { id: user.id, username: user.username, email: user.email },
        token
    });
});

// --- Sample Protected Route ---
router.get('/me', protectRoute, (req: AuthenticatedRequest, res: Response) => {
    // req.user is populated by protectRoute middleware
    if (req.user) {
        // Fetch full user details from DB if needed, here we use what's in the token
        const currentUser = users.find(u => u.id === req.user!.id);
        if (currentUser) {
            res.json({
                id: currentUser.id,
                username: currentUser.username,
                email: currentUser.email,
                message: "This is a protected route. Your token is valid."
            });
        } else {
            res.status(404).json({ message: "User not found, though token was valid."});
        }
    } else {
        // This case should ideally not be reached if protectRoute is working correctly
        res.status(500).json({ message: "Error: User data not found in request on protected route." });
    }
});


// --- Google Sign-In (Conceptual Placeholders) ---
// This would involve frontend integration with Google Sign-In SDK
// and backend validation of Google's ID token.
// Library: google-auth-library

router.post('/auth/google', async (req: Request, res: Response) => {
    const { idToken } = req.body; // Token received from Google Sign-In on frontend
    if (!idToken) {
        return res.status(400).json({ message: "Google ID token is required." });
    }
    try {
        // const {OAuth2Client} = require('google-auth-library');
        // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        // const ticket = await client.verifyIdToken({
        //     idToken: idToken,
        //     audience: process.env.GOOGLE_CLIENT_ID,
        // });
        // const payload = ticket.getPayload();
        // const userid = payload['sub'];
        // const email = payload['email'];
        // const name = payload['name'];
        //
        // Find or create user in your database based on email/userid
        // Generate your own JWT for the user session

        console.log("Received Google ID token (conceptual):", idToken.substring(0, 20) + "...");
        // Mock response:
        const mockUser = { id: 'google_user_123', username: 'GoogleUser', email: 'user@google.com' };
        const token = generateToken({id: mockUser.id, username: mockUser.username });
        res.json({
            message: "Google Sign-In successful (mock).",
            user: mockUser,
            token
        });

    } catch (error) {
        console.error("Google Sign-In error (conceptual):", error);
        res.status(401).json({ message: "Invalid Google ID token or server error." });
    }
});


// --- OTP-based Mobile Verification (Conceptual Placeholders) ---
// This would involve an SMS gateway (e.g., Twilio)
// Libraries: twilio

// 1. Request OTP
router.post('/auth/otp/request', async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
        return res.status(400).json({ message: "Mobile number is required." });
    }
    // Generate OTP (e.g., 6-digit random number)
    // Store OTP with expiry (e.g., in DB or Redis) associated with mobileNumber
    // Send OTP via SMS gateway
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP requested for ${mobileNumber}. Generated OTP (mock): ${otp}`);
    // Store this otp_MOCK[mobileNumber] = otp;
    res.json({ message: "OTP sent to mobile number (mock)." });
});

// 2. Verify OTP and Login/Register
router.post('/auth/otp/verify', async (req: Request, res: Response) => {
    const { mobileNumber, otp } = req.body;
    if (!mobileNumber || !otp) {
        return res.status(400).json({ message: "Mobile number and OTP are required." });
    }
    // Retrieve stored OTP for mobileNumber and check for match & expiry
    // if (otp_MOCK[mobileNumber] === otp) { ... }
    console.log(`OTP verification attempt for ${mobileNumber} with OTP ${otp} (mock).`);
    // If valid: Find or create user, generate JWT
    const mockUser = { id: `otp_user_${mobileNumber}`, username: `User${mobileNumber}`, email: `${mobileNumber}@example.com`}; // Mock
    const token = generateToken({id: mockUser.id, username: mockUser.username });
    res.json({
        message: "OTP verified successfully (mock).",
        user: mockUser,
        token
    });
    // else { res.status(400).json({ message: "Invalid or expired OTP." }); }
});


export default router;
