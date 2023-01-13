import { getById as getByIdFromDb } from '../common/db.js';
import { TABLE_NAME } from "../common/constants.js";
import {verifyJwt} from "../common/jwt.js";

const validateAuth = async (request, h) => {
    const token = request.headers.authorization;
    if (!token) {
        return h.response({ isValid: false });
    }

    try {
        const decoded = verifyJwt(token);
        // Check expiration token
        if (decoded.exp < Date.now() / 1000) {
            return h.response({ message: 'Token has expired' }) ;
        }
        // Adding decoding in credentials and changed flags to true
        request.auth.credentials = decoded;
        request.auth.isAuthenticated = true;
        request.auth.isAuthorized = true;

        const { id } = request.auth.credentials;

        // Get user from DB with saved id in credential
        const user = await getByIdFromDb(TABLE_NAME.USERS, id);
        if (user.rowCount === 0) {
            return h.response({ message: 'User does not exist' }) ;
        }
        return h.response({ message: 'Success' });
    } catch (error) {
        return h.response({ isValid: error }) ;
    }
};

export {
    validateAuth
}
