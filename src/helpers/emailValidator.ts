import uniqueCodes from '../constants/uniqueCodes';
import IResponseMessage from '../types/IResponseMessage';
import responseHandler from '../utils/responseHandler';

const emailValidator = (email: string): IResponseMessage => {
	if (!email || !email.trim()) {
		return responseHandler({
			uniqueCodeData: uniqueCodes.emailRequired,
			data: { type: 'error', payload: null },
			functionName: 'emailValidator',
		});
	}

	let emailClean = email.trim();
	emailClean = emailClean.toLowerCase();

	// email regex
	const emailRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

	if (!emailRegex.test(emailClean)) {
		return responseHandler({
			uniqueCodeData: uniqueCodes.emailNotValid,
			data: { type: 'error', payload: null },
			functionName: 'emailValidator',
		});
	}

	return responseHandler({
		uniqueCodeData: uniqueCodes.emailValid,
		data: { type: 'success', payload: emailClean },
		functionName: 'emailValidator',
	});
};

export default emailValidator;
