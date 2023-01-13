import Joi from "joi";

const newPost = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
})

const updatePost = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    status: Joi.string().valid('public','hidden').only().required(),
})

export const insertNewPostSchema = {
    payload: newPost
}

export const updatePostSchema = {
    payload: updatePost
}
