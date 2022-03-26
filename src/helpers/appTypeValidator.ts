import IResponseMessage from '../types/IResponseMessage';
import responseHandler from '../utils/responseHandler';

const appTypeValidator = (appType: string): IResponseMessage => {
	let appTypeClean = appType.trim();
	appTypeClean = appTypeClean.toLowerCase();

	if (!appTypeClean) {
		return responseHandler({
			statusCode: 400,
			message: 'App type is required',
			uniqueCode: 'APP_TYPE_REQUIRED',
			data: { type: 'error', payload: null },
			functionName: 'appTypeValidator',
		});
	}

	if (appType !== 'zing_owner' && appType !== 'zing_student') {
		return responseHandler({
			statusCode: 400,
			message: 'App type is required',
			uniqueCode: 'APP_TYPE_REQUIRED',
			data: { type: 'error', payload: null },
			functionName: 'appTypeValidator',
		});
	}

	return responseHandler({
		statusCode: 200,
		message: 'App type is valid',
		uniqueCode: 'APP_TYPE_VALID',
		data: { type: 'success', payload: appTypeClean },
		functionName: 'appTypeValidator',
	});
};

export default appTypeValidator;
