import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils';

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
}

export const protectRoute = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        const decodedUser = verifyToken(token);

        if (decodedUser) {
            req.user = decodedUser; // Add user to request object
            next(); // User is authenticated, proceed to the route
        } else {
            res.status(401).json({ message: 'Not authorized, token failed verification' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no Bearer token' });
    }
};
