import envConfig from '../config/config';
import IResponseMessage from '../types/IResponseMessage';
import IResponseParams from '../types/IResponseParams';

const responseHandler = (responseObject: IResponseParams) => {
	const { uniqueCodeData, data, functionName } = responseObject;

	const { message, status, code, responseCode } = uniqueCodeData;

	const response: IResponseMessage = {
		message,
		statusCode: status,
		uniqueCode: code,
		data,
		functionName,
		responseCode,
	};

	if (envConfig.ENVIRONMENT === 'production') {
		response.functionName = null;
	}

	return response;
};

export default responseHandler;
