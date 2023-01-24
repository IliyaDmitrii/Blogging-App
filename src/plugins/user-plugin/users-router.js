import { signUp, signInUser, signInAdmin } from './users-handler.js';
import { insertNewUserSchema, signInUserSchema } from './users-shema.js';

async function register(server) {
  server.route({
    method: 'POST',
    path: '/signup',
    handler: signUp,
    options: {
      auth: false,
      tags: ['api'],
      validate: {
        payload: insertNewUserSchema.payload
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/sign-in',
    handler: signInUser,
    options: {
      auth: false,
      tags: ['api'],
      validate: {
        payload: signInUserSchema.payload
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/admin/sign-in',
    handler: signInAdmin,
    options: {
      auth: false,
      tags: ['api'],
      validate: {
        payload: signInUserSchema.payload
      }
    }
  });
}

const userRoute = {
  name: 'user',
  register
};

export default userRoute;
