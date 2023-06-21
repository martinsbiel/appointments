import {Request, Response, NextFunction} from 'express';
import Logger from '../../config/logger';

export const roleMiddleware = (roles: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = res.locals.jwtPayload.role;

            if(roles.indexOf(role) > -1){
                return next();
            } else {
                return res.status(401).json({error: 'You\'re not authorized to see this.'});
            }
        } catch(e: any){
            Logger.error(`Error: ${e.message}`);

            return res.status(500).json({error: 'Try again later!'});
        }
    }
}