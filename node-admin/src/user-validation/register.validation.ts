import Joi from "joi";

export const RegisterValidation = Joi.object({
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    password_confirm: Joi.string().required(),
}).options({
    abortEarly: false,
    allowUnknown: false
});
