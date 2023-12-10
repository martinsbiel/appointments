import {Request, Response} from 'express';
import bcrypt from 'bcrypt';

// Model
import {User} from '../entity/User';

// Logger
import Logger from '../../config/logger';

// Database
import handleGetRepository from '../data-source';

export async function createUser(req: Request, res: Response){
    try {
        const data = req.body;

        const count = await handleGetRepository(User).count();

        // the first registered user will always be an admin
        const user = handleGetRepository(User).create({
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(data.password, 10),
            role: count === 0 ? 1 : 2
        });

        const results = await handleGetRepository(User).save(user);

        return res.status(201).json(results);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function findUserById(req: Request, res: Response){
    try {
        const id = Number(req.params.id);

        const user = await handleGetRepository(User).findOne({
            where: {
                id
            },
            relations: {
                appointments: true
            }
        });

        if(!user){
            return res.status(404).json({error: 'This user doesn\'t exist.'});
        }

        if(user.id !== res.locals.jwtPayload.id && res.locals.jwtPayload.role !== 1){
            return res.status(401).json({error: 'You\'re not authorized to see this.'});
        }

        return res.status(200).json(user);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function getAllUsers(req: Request, res: Response){
    try {
        const users = await handleGetRepository(User).find({
            relations: {
                appointments: true
            },
        });

        const count = await handleGetRepository(User).count();

        if(count === 0){
            return res.status(404).json({error: 'No users found.'});
        }

        return res.status(200).json(users);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function removeUser(req: Request, res: Response){
    try {
        const id = Number(req.params.id);

        const user = await handleGetRepository(User).findOneBy({
            id,
        });

        if(!user){
            return res.status(404).json({error: 'This user doesn\'t exist.'});
        }

        if(user.id !== res.locals.jwtPayload.id && res.locals.jwtPayload.role !== 1){
            return res.status(401).json({error: 'You\'re not authorized to see this.'});
        }

        await handleGetRepository(User).softDelete(id);

        return res.status(200).json({msg: 'User removed successfully!'});
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function updateUser(req: Request, res: Response){
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const user = await handleGetRepository(User).findOneBy({
            id,
        });

        if(!user){
            return res.status(404).json({error: 'This user doesn\'t exist.'});
        }

        if(user.id !== res.locals.jwtPayload.id && res.locals.jwtPayload.role !== 1){
            return res.status(401).json({error: 'You\'re not authorized to see this.'});
        }

        handleGetRepository(User).merge(user, {
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(data.password, 10)
        });
        const results = await handleGetRepository(User).save(user);

        return res.status(200).json(results);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}