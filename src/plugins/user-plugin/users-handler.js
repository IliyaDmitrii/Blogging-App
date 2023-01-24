import { v4 as uuid } from 'uuid';
import { createJwt } from '../../common/jwt.js';
import {
  compare as comparePassword,
  hash as hashPassword
} from '../../common/bcrypt.js';
import {
  getByEmail as getByEmailFromDb,
  insert as insertToDb
} from '../../common/db.js';
import {
  ROLES,
  TABLE_NAME
} from '../../common/constants.js';

export async function signUp(request, h) {
  const {
    name, email, password
  } = request.payload;

  // Prepares the user payload for insertion into the database
  const userId = uuid();
  const currentDate = new Date().toISOString();
  const hashedPassword = await hashPassword(password);
  // New user payload
  const newUser = {
    id: userId,
    name,
    email,
    password: hashedPassword,
    role: ROLES.BLOGGER,
    created_at: currentDate,
    updated_at: currentDate
  };

  try {
    const existingBlogger = await getByEmailFromDb(TABLE_NAME.USERS, email);
    if (existingBlogger) {
      return h.response({ message: 'User with email already exists in db' }).code(409);
    }
    // Inserted in to db
    const user = await insertToDb(TABLE_NAME.USERS, newUser);
    // Signed jwt with user payload
    const token = createJwt({ id: user.id, role: user.role });

    return h.response({ message: 'Success', token }).code(200);
  } catch (e) {
    return h.response({ message: 'Failed to sign up' }).code(500);
  }
}

async function signInHelper(email, password, role, h) {
  try {
    const user = await getByEmailFromDb(TABLE_NAME.USERS, email);
    if (!user) {
      return h.response({ message: 'Invalid credentials' }).code(401);
    }
    if (role === ROLES.ADMIN && user.role !== ROLES.ADMIN) {
      return h.response({ message: 'Not have permissions to perform this actions' }).code(403);
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return h.response({ message: 'Invalid password' }).code(401);
    }
    const token = createJwt({ id: user.id, role: user.role });

    return h.response({ email: user.email, token }).code(200);
  } catch (e) {
    return h.response({ message: `Failed to sign in + ${e}` }).code(500);
  }
}


export async function signInUser(request, h) {
  const { email, password } = request.payload;
  return signInHelper(email, password, ROLES.BLOGGER, h);
}

export async function signInAdmin(request, h) {
  const { email, password } = request.payload;
  return signInHelper(email, password, ROLES.ADMIN, h);
}
