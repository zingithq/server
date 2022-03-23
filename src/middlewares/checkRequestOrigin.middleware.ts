import { Request, Response, NextFunction } from 'express';

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
	const reqOrigin: string = req.headers['req-origin'] as string;
	if (!reqOrigin || !reqOrigin.trim()) {
		return res.status(403).json({
			response: errorHandler('REQ_ORIGIN_REQUIRED'),
		});
	}

	const reqOriginClean: string = reqOrigin.trim();
	const decryptedOrigin: string = decryptText(reqOriginClean);

	const originParts: string[] = decryptedOrigin.split('/');
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

	if (diff > 10) {
		return res.status(403).json({
			response: errorHandler('REQ_ORIGIN_EXPIRED'),
		});
	}

	if (originApp !== 'zing_student' && originApp !== 'zing_owner') {
		return res.status(403).json({
			response: errorHandler('REQ_ORIGIN_INVALID'),
		});
	}

	return next();
};
export default checkRequestOrigin;
