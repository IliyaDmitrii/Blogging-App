import { updatePostSchema, insertNewPostSchema } from './posts-schema.js';
import { validateAuth } from '../../middleware/validateAuth.js';
import {
  createPost,
  getAllPost,
  getPostById,
  removePost,
  updatePost
} from './posts-handler.js';

// eslint-disable-next-line max-lines-per-function
async function register(server) {
  server.route({
    method: 'POST',
    path: '/posts',
    handler: createPost,
    options: {
      // Middleware for authJwt
      pre: [{ method: validateAuth }],
      tags: ['api'],
      validate: {
        payload: insertNewPostSchema.payload
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/posts/{id}',
    handler: getPostById,
    options: {
      // Middleware for authJwt
      pre: [{ method: validateAuth }],
      tags: ['api']
    }
  });

  server.route({
    method: 'GET',
    path: '/posts',
    handler: getAllPost,
    options: {
      // Middleware for authJwt
      pre: [{ method: validateAuth }],
      tags: ['api']
    }
  });

  server.route({
    method: 'PUT',
    path: '/posts/{id}',
    handler: updatePost,
    options: {
      // Middleware for authJwt
      pre: [{ method: validateAuth }],
      tags: ['api'],
      validate: {
        payload: updatePostSchema.payload
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/posts/{id}',
    handler: removePost,
    options: {
      // Middleware for authJwt
      pre: [{ method: validateAuth }],
      tags: ['api'],
    }
  });
}

const postRoute = {
  name: 'post',
  register
};

export default postRoute;
