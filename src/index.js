import Config from 'config';
import Hapi from '@hapi/hapi';
import userRoute from './plugins/user-plugin/users-router.js';
import postRoute from './plugins/post-plugin/posts-router.js';
import failAction from './common/failAction.js';

// Config for Hapi server
const hapiOptions = {
  port: Config.get('server.port'),
  host: Config.get('server.host'),
  routes: {
    cors: {
      origin: ['*'],
      maxAge: 86400,
      headers: [
        'Accept',
        'Authorization',
        'Content-Type',
      ],
      credentials: false
    },
    validate: {
      failAction
    }
  }
};

(async () => {
  const server = Hapi.server(hapiOptions);

  // Register plugins
  await server.register(userRoute);
  await server.register(postRoute);

  await server.start();
  // eslint-disable-next-line no-console
  console.log('Server running on port:', server.info.port);
  // eslint-disable-next-line no-console
  console.log('Server url:', server.info.uri);
  return server;
})();

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log(`Error is:${err}`);
  process.exit(1);
});