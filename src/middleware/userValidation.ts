import {body, CustomValidator} from 'express-validator';
import {AppDataSource} from '../data-source';
import {User} from '../entity/User';

const isValidEmail: CustomValidator = async value => {
    return await AppDataSource.getRepository(User).findOne({
            where: {
                email: value
            }
        }).then(user => {
            if(user){
                return Promise.reject('Email already in use.');
            }
    });
};

export const userCreateValidation = () => {
    return [
        body('name').isString().withMessage('Name is required.'),
        body('email').isString().withMessage('Email is required.').isEmail().withMessage('Enter a valid email address.').custom(isValidEmail),
        body('password').isString().withMessage('Password is required.')
    ];
}

export const userUpdateValidation = () => {
    return [
        body('name').isString().withMessage('Name is required.'),
        body('email').isString().withMessage('Email is required.').isEmail().withMessage('Enter a valid email address.'),
        body('password').isString().withMessage('Password is required.')
    ];
}

export const userLoginValidation = () => {
    return [
        body('email').isString().withMessage('Email is required.').isEmail().withMessage('Enter a valid email address.'),
        body('password').isString().withMessage('Password is required.')
    ];
}