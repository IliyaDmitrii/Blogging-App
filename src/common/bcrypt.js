import bcrypt from 'bcrypt';
import Config from 'config';

const saltRounds = Config.get('bcrypt.rounds');

export async function hash(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

export async function compare(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
