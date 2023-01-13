import Config from 'config';
import Jwt from 'jsonwebtoken';

const tokenExpiresIn = Config.get('auth.tokenExpiresIn');

export function createJwt(payload, expiresIn = tokenExpiresIn) {
    if (payload == null) {
        throw new Error('payload must be supplied when creating a JWT');
    }

    if (expiresIn == null) {
        throw new Error('expiresIn must be supplied when creating a JWT');
    }

    return Jwt.sign(payload, Config.get('jwt.secret'), { expiresIn });
}

export function verifyJwt(token) {
    return Jwt.verify(token, Config.get('jwt.secret'));
}