import { getById as getByIdFromDb } from '../common/db.js';
import { TABLE_NAME } from '../common/constants.js';
import { verifyJwt } from '../common/jwt.js';

const validateAuth = async (request, h) => {
  const token = request.headers.authorization;
  if (!token) {
    return h.response({ message: 'Invalid token' });
  }

  try {
    const decoded = verifyJwt(token);
    // Check expiration token
    if (decoded.exp < Date.now() / 1000) {
      return h.response({ message: 'Token has expired' });
    }
    // Adding decoding in credentials and changed flags to true
    request.auth.credentials = decoded;

    const { id } = request.auth.credentials;

    const user = await getByIdFromDb(TABLE_NAME.USERS, id);
    if (user.rowCount === 0) {
      return h.response({ message: 'User does not exist' });
    }
    return h.authenticated(user);
  } catch (error) {
    return h.response({ message: error });
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  validateAuth
};
