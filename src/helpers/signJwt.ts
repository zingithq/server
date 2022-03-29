import jwt from 'jsonwebtoken';

import envConfig from '../config/config';

const { JWT_SECRET } = envConfig;

const signJwt = (payload: { email: string; _id: string }): string => {
	const token = jwt.sign(payload, JWT_SECRET);
	return token;
};

export default signJwt;
