import Joi from 'joi';

const user = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid('ADMIN', 'BLOGGER').required(),
  created_at: Joi.string().isoDate().required(),
  updated_at: Joi.string().isoDate().required()
});

const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required()
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required()
});

export const insertNewUserSchema = {
  payload: signUpSchema,
  response: {
    status: {
      200: user
    }
  }
};

export const signInUserSchema = {
  payload: signInSchema,
  response: {
    status: {
      200: user
    }
  }
};
