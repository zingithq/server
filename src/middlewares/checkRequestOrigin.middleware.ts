import { Request, Response, NextFunction } from 'express';
import envConfig from '../config/config';

import decryptText from '../helpers/decryptText';
import responseHandler from '../utils/responseHandler';

const errorHandler = (uniqueCode: string) =>
	responseHandler({
		statusCode: 403,
		message: 'Request origin error!',
		uniqueCode,
		data: { type: 'error', payload: null },
		functionName: 'checkRequestOrigin',
	});

const checkRequestOrigin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.headers['req-origin']) {
		return errorHandler('REQ_ORIGIN_REQUIRED');
	}

	if (typeof req.headers['req-origin'] !== 'string') {
		return errorHandler('REQ_ORIGIN_REQUIRED');
	}

	const reqOrigin = req.headers['req-origin'];
	if (!reqOrigin || !reqOrigin.trim()) {
		return res.status(403).json({
			response: errorHandler('REQ_ORIGIN_REQUIRED'),
		});
	}

	const reqOriginClean = reqOrigin.trim();
	const decryptedOrigin = decryptText(reqOriginClean);

	const originParts = decryptedOrigin.split('/');
	const originTime = Number(originParts[0]);
	const originApp = originParts[1];

	if (!originTime || !originApp) {
		return res.status(403).json({
			response: errorHandler('REQ_ORIGIN_INVALID'),
		});
	}

	const nowInSeconds = Math.floor(new Date().getTime() / 1000);
	const originTimeInSeconds = Math.floor(originTime / 1000);
	const diff = nowInSeconds - originTimeInSeconds;

	const secondsToExpire = envConfig.ORIGIN_EXPIRY_TIME;
	if (diff > secondsToExpire) {
		return res.status(403).json({
			response: errorHandler('REQ_ORIGIN_EXPIRED'),
		});
	}

	if (originApp !== 'zing_student' && originApp !== 'zing_owner') {
		return res.status(403).json({
			response: errorHandler('REQ_ORIGIN_INVALID'),
		});
	}

	res.locals.appType = originApp as string;
	return next();
};

export default checkRequestOrigin;
