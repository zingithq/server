import IResponseMessage from '../types/IResponseMessage';
import responseHandler from '../utils/responseHandler';

const emailValidator = (email: string): IResponseMessage => {
	let emailClean = email.trim();
	emailClean = emailClean.toLowerCase();

	if (!emailClean) {
		return responseHandler({
			statusCode: 400,
			message: 'Email is required',
			uniqueCode: 'EMAIL_REQUIRED',
			data: { type: 'error', payload: null },
			functionName: 'emailValidator',
		});
	}

	// email regex
	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

	if (!emailRegex.test(emailClean)) {
		return responseHandler({
			statusCode: 400,
			message: 'Email is not valid',
			uniqueCode: 'EMAIL_NOT_VALID',
			data: { type: 'error', payload: null },
			functionName: 'emailValidator',
		});
	}

	return responseHandler({
		statusCode: 200,
		message: 'Email is valid',
		uniqueCode: 'EMAIL_VALID',
		data: { type: 'success', payload: emailClean },
		functionName: 'emailValidator',
	});
};

export default emailValidator;
