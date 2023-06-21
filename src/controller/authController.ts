import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Model
import {User} from '../entity/User';

// Logger
import Logger from '../../config/logger';

// Database
import {AppDataSource} from '../data-source';

export async function loginUser(req: Request, res: Response){
    try {
        const {
            email,
            password
        } = req.body;
    
        const user = await AppDataSource.getRepository(User).findOneBy({
            email
        });
    
        if(!user){
            return res.status(404).json({error: 'User not found!'});
        }

        const result = await bcrypt.compare(password, user.password);
    
        if(result){
            const token = jwt.sign({id: user.id, role: user.role}, process.env.SECRET_KEY, {expiresIn: '1h'});

            return res.status(200).json({token: token});
        } else {
            return res.status(403).json({error: 'Incorrect credentials.'});
        }
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}