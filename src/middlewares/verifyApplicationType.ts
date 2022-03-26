import { Request, Response, NextFunction } from 'express';
import appTypeValidator from '../helpers/appTypeValidator';

import IResponseMessage from '../types/IResponseMessage';
import responseHandler from '../utils/responseHandler';

const verifyApplicationType =
	(requiredAppType: string) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const { appType } = res.locals;

		const appValidation = appTypeValidator(appType);
		if (appValidation.data.type === 'error') {
			return res
				.status(appValidation.statusCode)
				.json({ response: appValidation });
		}

		const cleanAppType = appValidation.data.payload;

		if (cleanAppType !== requiredAppType) {
			const errorMessage: IResponseMessage = responseHandler({
				statusCode: 400,
				message: 'Application type is not valid',
				uniqueCode: 'APP_TYPE_NOT_VALID',
				data: { type: 'error', payload: null },
				functionName: 'verifyApplicationType',
			});
			return res.status(errorMessage.statusCode).json(errorMessage);
		}
		return next();
	};

export default verifyApplicationType;
