import { Request, Response, NextFunction } from 'express';

import uniqueCodes from '../constants/uniqueCodes';
import envConfig from '../config/config';
import decryptText from '../helpers/decryptText';
import IUniqueCode from '../types/IUniqueCode';
import responseHandler from '../utils/responseHandler';

const errorHandler = (uniqueCodeData: IUniqueCode) =>
	responseHandler({
		uniqueCodeData,
		data: { type: 'error', payload: null },
		functionName: 'checkRequestOrigin',
	});

/**
 *
 * @description: Middelware to check:
 *	 - if the request is coming from one of the two apps or not
 *	 - if the incomming request is expired or not
 */

const checkRequestOrigin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.headers['req-origin']) {
		return res
			.status(errorHandler(uniqueCodes.reqOriginRequired).statusCode)
			.json({
				response: errorHandler(uniqueCodes.reqOriginRequired),
			});
	}

	if (typeof req.headers['req-origin'] !== 'string') {
		return res
			.status(errorHandler(uniqueCodes.reqOriginInvalid).statusCode)
			.json({
				response: errorHandler(uniqueCodes.reqOriginInvalid),
			});
	}

	const reqOrigin = req.headers['req-origin'];
	if (!reqOrigin || !reqOrigin.trim()) {
		return res
			.status(errorHandler(uniqueCodes.reqOriginRequired).statusCode)
			.json({
				response: errorHandler(uniqueCodes.reqOriginRequired),
			});
	}

	const reqOriginClean = reqOrigin.trim();

	const decryptedOrigin = decryptText(reqOriginClean);

	const originParts = decryptedOrigin.split('/');

	const originTime = Number(originParts[0]);
	const originApp = originParts[1];

	if (!originApp) {
		return res
			.status(errorHandler(uniqueCodes.reqOriginInvalid).statusCode)
			.json({
				response: errorHandler(uniqueCodes.reqOriginInvalid),
			});
	}

	if (!originTime) {
		return res
			.status(errorHandler(uniqueCodes.reqOriginInvalid).statusCode)
			.json({
				response: errorHandler(uniqueCodes.reqOriginInvalid),
			});
	}

	const nowInSeconds = Math.floor(new Date().getTime() / 1000);
	const originTimeInSeconds = Math.floor(originTime / 1000);
	const diff = nowInSeconds - originTimeInSeconds;

	const secondsToExpire = envConfig.ORIGIN_EXPIRY_TIME;
	if (diff > secondsToExpire) {
		return res
			.status(errorHandler(uniqueCodes.reqOriginExpired).statusCode)
			.json({
				response: errorHandler(uniqueCodes.reqOriginExpired),
			});
	}

	if (originApp !== 'zing_consumer' && originApp !== 'zing_owner') {
		return res
			.status(errorHandler(uniqueCodes.reqOriginInvalid).statusCode)
			.json({
				response: errorHandler(uniqueCodes.reqOriginInvalid),
			});
	}

	res.locals.appType = originApp as string;
	return next();
};

export default checkRequestOrigin;
