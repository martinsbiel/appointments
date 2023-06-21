import {body} from 'express-validator';

export const appointmentCreateValidation = () => {
    return [
        body('title').isString().withMessage('Title is required.'),
        body('content').isString().withMessage('Description is required.'),
        body('target_date').isISO8601().toDate().withMessage('Enter a valid target date, format should be: YYYY-MM-DD hh:mm:ss.'),
    ];
}

export const appointmentUpdateValidation = () => {
    return [
        body('title').isString().withMessage('Title is required.'),
        body('content').isString().withMessage('Description is required.'),
        body('target_date').isISO8601().toDate().withMessage('Enter a valid target date, format should be: YYYY-MM-DD hh:mm:ss.'),
    ];
}