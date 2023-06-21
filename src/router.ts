import {Router, Request, Response} from 'express';
import {loginUser} from './controller/authController';
import {createUser, findUserById, getAllUsers, removeUser, updateUser} from './controller/userController';
import {authMiddleware} from './middleware/authMiddleware';
import {roleMiddleware} from './middleware/roleMiddleware';
import {createAppointment, findAppointmentById, getAllAppointmentsByUser, removeAppointment, updateAppointment} from './controller/appointmentController';

// Validations
import {validate} from './middleware/handleValidation';
import {userCreateValidation, userLoginValidation, userUpdateValidation} from './middleware/userValidation';
import {appointmentCreateValidation, appointmentUpdateValidation} from './middleware/appointmentValidation';

const router = Router();

export default router.get('/test', (req: Request, res: Response) => {
    res.status(200).send('API working!');
}).post('/user', userCreateValidation(), validate, createUser)
.get('/user/:id', [authMiddleware, roleMiddleware([1, 2])], findUserById)
.get('/user', [authMiddleware, roleMiddleware([1])], getAllUsers)
.delete('/user/:id', [authMiddleware, roleMiddleware([1, 2])], removeUser)
.patch('/user/:id', [authMiddleware, roleMiddleware([1, 2])], userUpdateValidation(), validate, updateUser)

.post('/appointment', [authMiddleware, roleMiddleware([1, 2])], appointmentCreateValidation(), validate, createAppointment)
.get('/appointment/:id', [authMiddleware, roleMiddleware([1, 2])], findAppointmentById)
.get('/appointment', [authMiddleware, roleMiddleware([1, 2])], getAllAppointmentsByUser)
.delete('/appointment/:id', [authMiddleware, roleMiddleware([1, 2])], removeAppointment)
.patch('/appointment/:id', [authMiddleware, roleMiddleware([1, 2])], appointmentUpdateValidation(), validate, updateAppointment)

.post('/login', userLoginValidation(), validate, loginUser);