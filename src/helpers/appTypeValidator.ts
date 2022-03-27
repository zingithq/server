import uniqueCodes from '../constants/uniqueCodes';
import IResponseMessage from '../types/IResponseMessage';
import responseHandler from '../utils/responseHandler';

const appTypeValidator = (appType: string): IResponseMessage => {
	let appTypeClean = appType.trim();
	appTypeClean = appTypeClean.toLowerCase();

	if (!appTypeClean) {
		return responseHandler({
			uniqueCodeData: uniqueCodes.appTypeRequired,
			data: { type: 'error', payload: null },
			functionName: 'appTypeValidator',
		});
	}

	if (appType !== 'zing_owner' && appType !== 'zing_student') {
		return responseHandler({
			uniqueCodeData: uniqueCodes.appTypeNotValid,
			data: { type: 'error', payload: null },
			functionName: 'appTypeValidator',
		});
	}

	return responseHandler({
		uniqueCodeData: uniqueCodes.appTypeValid,
		data: { type: 'success', payload: appTypeClean },
		functionName: 'appTypeValidator',
	});
};

export default appTypeValidator;
