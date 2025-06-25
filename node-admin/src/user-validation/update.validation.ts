// src/user-validation/update.validation.ts
import Joi from "joi";

export const UpdateUserValidation = Joi.object({
    first_name: Joi.string().min(2).max(50).optional(),
    last_name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
});

export const ChangePasswordValidation = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
        .message("Password must include uppercase, lowercase, number and special character")
        .required(),

    confirm_password: Joi.valid(Joi.ref("new_password"))
        .required()
        .messages({ "any.only": "Passwords do not match" })
});


export const ForgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});
