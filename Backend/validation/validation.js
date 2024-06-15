import {body} from 'express-validator'


export const signUpValidationRules = () => {
  return [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('password is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role').notEmpty().withMessage('Role is required'),
  ];
};

export const signInValidation = () => {
  return [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('password is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ];
};


export const forgotPasswordValidation = () => {
  return [
    body('email').notEmpty().withMessage('Email is required'),
    body('email').isEmail().withMessage('Email is invalid'),
 
  ];
};


export const resetPasswordValidation = () => {
  return [
    body('password').notEmpty().withMessage('password is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword is required'),
  ];
};