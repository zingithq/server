import { Request, Response, NextFunction } from 'express';

import uniqueCodes from '../constants/uniqueCodes';
import appTypeValidator from '../helpers/appTypeValidator';
import IResponseMessage from '../types/IResponseMessage';
import responseHandler from '../utils/responseHandler';

/**
 * @description: Conditional middleware to check:
 * 	- if the request origin matches the required origin for that API
 */

const verifyApplicationType =
	(requiredAppType: string) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const { appType } = res.locals;

		const appValidation: IResponseMessage = appTypeValidator(appType);
		if (appValidation.data.type === 'error') {
			return res
				.status(appValidation.statusCode)
				.json({ response: appValidation });
		}

		const cleanAppType = appValidation.data.payload;

		if (cleanAppType !== requiredAppType) {
			const errorMessage: IResponseMessage = responseHandler({
				uniqueCodeData: uniqueCodes.appTypeNotValid,
				data: { type: 'error', payload: null },
				functionName: 'verifyApplicationType',
			});
			return res
				.status(errorMessage.statusCode)
				.json({ response: errorMessage });
		}
		return next();
	};

export default verifyApplicationType;
