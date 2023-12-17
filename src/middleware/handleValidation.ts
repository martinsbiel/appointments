import {Request, Response, NextFunction} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void | Response => {
    const errors: Result<ValidationError> = validationResult(req);

    if(errors.isEmpty()){
        return next();
    }

    const extractedErrors: object[] = [];

    errors.array().map((err) => extractedErrors.push({[err.param]: err.msg}));

    return res.status(422).json({errors: extractedErrors});
}