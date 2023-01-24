import Config from 'config';
import { v4 as uuid } from 'uuid';
import Twilio from 'twilio';
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

const client = new Twilio(Config.get('twilio.TWILIO_SID'), Config.get('twilio.TWILIO_AUTH_TOKEN'));

export async function signUpUser(request, h) {
  const {
    name, email, password, phone
  } = request.payload;

  // Prepares the user payload for insertion into the database
  const userId = uuid();
  const currentDate = new Date().toISOString();
  const min = 100000;
  const max = 999999;
  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  const hashedPassword = await hashPassword(password);
  // New user payload
  const newUser = {
    id: userId,
    name,
    email,
    password: hashedPassword,
    role: ROLES.BLOGGER,
    phone,
    code,
    created_at: currentDate,
    updated_at: currentDate
  };

  try {
    const existingBlogger = await getByEmailFromDb(TABLE_NAME.USERS, email);
    if (existingBlogger) {
      return h.response({ message: 'User with email already exists' }).code(409);
    }
    // Inserted in to db
    const user = await insertToDb(TABLE_NAME.USERS, newUser);
    // Signed jwt with user payload
    await client.messages.create({
      from: Config.get('twilio.TWILIO_PHONE_NUMBER'),
      to: phone,
      body: `Scaoala wai pula ${code}`
    });

    const token = createJwt({ id: user.id, role: user.role });

    return h.response({ message: 'Verification code sent', token }).code(200);
  } catch (e) {
    return h.response({ message: `Failed to sign up + ${e}` }).code(500);
  }
}

export async function signInUser(request, h) {
  const { email, password } = request.payload;

  try {
    const user = await getByEmailFromDb(TABLE_NAME.USERS, email);
    if (!user) {
      return h.response({ message: 'Invalid credentials' }).code(401);
    }
    // Verified if is valid password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return { message: 'Invalid password' };
    }
    const token = createJwt({ id: user.id, role: user.role });

    return h.response({ email: user.email, token });
  } catch (e) {
    return h.response({ message: 'Failed to sign in' }).code(500);
  }
}

export async function signInAdmin(request, h) {
  const { email, password } = request.payload;

  try {
    const user = await getByEmailFromDb(TABLE_NAME.USERS, email);
    if (!user) {
      return h.response({ message: 'Invalid credentials' }).code(401);
    }
    if (user.role !== ROLES.ADMIN) {
      return h.response({ message: 'Not have permissions to perform this actions' }).code(403);
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return h.response({ message: 'Invalid password' }).code(401);
    }
    const token = createJwt({ id: user.id, role: user.role });

    return h.response({ email: user.email, token }).code(200);
  } catch (e) {
    return h.response({ message: `Failed to sign in you not admin + ${e}` }).code(500);
  }
}
