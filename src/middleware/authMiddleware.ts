import {Request, Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import Logger from '../../config/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
        const authToken: string = req.headers['authorization'];

        if(!authToken){
            return res.status(401).json({error: 'You\'re not logged in.'});
        }

        const bearer: string[] = authToken.split(' ');
        const token: string = bearer[1];
        const decoded: string | JwtPayload = jwt.verify(token, process.env.SECRET_KEY);
        
        res.locals.jwtPayload = decoded;

        if(decoded){
            return next();
        } else {
            return res.status(401).json({error: 'You\'re not logged in.'});
        }
    } catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}