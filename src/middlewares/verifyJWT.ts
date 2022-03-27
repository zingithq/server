import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserWithEmailOrId } from '../components/user/user.dal';

import envConfig from '../config/config';
import uniqueCodes from '../constants/uniqueCodes';
import appTypeValidator from '../helpers/appTypeValidator';
import IResponseMessage from '../types/IResponseMessage';
import responseHandler from '../utils/responseHandler';

const unauthorizedMessage = (): IResponseMessage =>
	responseHandler({
		uniqueCodeData: uniqueCodes.unauthorized,
		data: { type: 'error', payload: null },
		functionName: 'verifyToken',
	});

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	const { JWT_SECRET }: { JWT_SECRET: string } = envConfig;

	const { authorization } = req.headers;

	if (
		!authorization ||
		!authorization.startsWith('Bearer ') ||
		!authorization.trim()
	) {
		return res
			.status(unauthorizedMessage().statusCode)
			.json({ response: unauthorizedMessage() });
	}

	const token = authorization.split(' ')[1];

	return jwt.verify(token, JWT_SECRET, async (err, decoded) => {
		if (err) {
			return res
				.status(unauthorizedMessage().statusCode)
				.json({ response: unauthorizedMessage() });
		}

		if (!decoded) {
			return res
				.status(unauthorizedMessage().statusCode)
				.json({ response: unauthorizedMessage() });
		}

		const { appType } = res.locals;
		const appValidation = appTypeValidator(appType);

		if (appValidation.data.type === 'error') {
			return res
				.status(unauthorizedMessage().statusCode)
				.json({ response: unauthorizedMessage() });
		}

		const appTypeClean = appValidation.data.payload as string;

		interface JwtPayload {
			_id: string;
		}

		const { _id } = decoded as JwtPayload;

		const loggedInUser: IResponseMessage = await getUserWithEmailOrId({
			email: null,
			userId: _id,
			appType: appTypeClean,
		});

		if (loggedInUser.data.type !== 'success') {
			return res
				.status(unauthorizedMessage().statusCode)
				.json({ response: unauthorizedMessage() });
		}

		res.locals.loggedInUser = loggedInUser.data.payload;

		return next();
	});
};

export default verifyToken;
