import {Request, Response} from 'express';

// Model
import {Appointment} from '../entity/Appointment';
import {User} from '../entity/User';

// Logger
import Logger from '../../config/logger';

// Database
import handleGetRepository from '../data-source';

export async function createAppointment(req: Request, res: Response){
    try {
        const user = await handleGetRepository(User).findOneBy({
            id: res.locals.jwtPayload.id
        });

        const data = req.body;

        const appointment = handleGetRepository(Appointment).create({
            title: data.title,
            content: data.content,
            target_date: data.target_date,
            user
        });

        const results = await handleGetRepository(Appointment).save(appointment);

        return res.status(201).json(results);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function findAppointmentById(req: Request, res: Response){
    try {
        const id = Number(req.params.id);

        const appointment = await handleGetRepository(Appointment).findOne({
            where: {
                id
            },
            relations: {
                user: true
            }
        });

        if(!appointment){
            return res.status(404).json({error: 'This appointment doesn\'t exist.'});
        }

        if(appointment.user.id !== res.locals.jwtPayload.id && res.locals.jwtPayload.role !== 1){
            return res.status(401).json({error: 'You\'re not authorized to see this.'});
        }

        return res.status(200).json(appointment);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function getAllAppointmentsByUser(req: Request, res: Response){
    try {
        const id = res.locals.jwtPayload.id;

        const appointments = await handleGetRepository(Appointment).find({
            where: {
                user: {
                    id
                }
            },
            relations: {
                user: true
            }
        });

        if(appointments.length === 0){
            return res.status(404).json({error: 'No appointments found.'});
        }

        return res.status(200).json(appointments);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function removeAppointment(req: Request, res: Response){
    try {
        const id = Number(req.params.id);

        const appointment = await handleGetRepository(Appointment).findOne({
            where: {
                id
            },
            relations: {
                user: true
            }
        });

        if(!appointment){
            return res.status(404).json({error: 'This appointment doesn\'t exist.'});
        }

        if(appointment.user.id !== res.locals.jwtPayload.id && res.locals.jwtPayload.role !== 1){
            return res.status(401).json({error: 'You\'re not authorized to see this.'});
        }

        await handleGetRepository(Appointment).softDelete(id);

        return res.status(200).json({msg: 'Appointment removed successfully!'});
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}

export async function updateAppointment(req: Request, res: Response){
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const appointment = await handleGetRepository(Appointment).findOne({
            where: {
                id
            },
            relations: {
                user: true
            }
        });

        if(!appointment){
            return res.status(404).json({error: 'This appointment doesn\'t exist.'});
        }     

        if(appointment.user.id !== res.locals.jwtPayload.id && res.locals.jwtPayload.role !== 1){
            return res.status(401).json({error: 'You\'re not authorized to see this.'});
        }

        handleGetRepository(Appointment).merge(appointment, {
            title: data.title,
            content: data.content,
            target_date: data.target_date,
            is_done: data.is_done
        });

        const results = await handleGetRepository(Appointment).save(appointment);

        return res.status(200).json(results);
    }catch(e: any){
        Logger.error(`Error: ${e.message}`);

        return res.status(500).json({error: 'Try again later!'});
    }
}