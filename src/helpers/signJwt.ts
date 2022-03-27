import jwt from 'jsonwebtoken';

import envConfig from '../config/config';

const { JWT_SECRET }: { JWT_SECRET: string } = envConfig;

const signJwt = (payload: { email: string; _id: string }): string => {
	const token = jwt.sign(payload, JWT_SECRET);
	return token;
};

export default signJwt;
