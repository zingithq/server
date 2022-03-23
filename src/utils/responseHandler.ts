import envConfig from '../config/config';
import IResponseMessage from '../types/IResponseMessage';
import IResponseParams from '../types/IResponseParams';

const responseHandler = (responseObject: IResponseParams) => {
	const { message, statusCode, uniqueCode, data, functionName } =
		responseObject;

	const response: IResponseMessage = {
		message,
		statusCode,
		uniqueCode,
		data,
		functionName,
	};

	if (envConfig.ENVIRONMENT === 'production') {
		response.functionName = null;
	}

	return response;
};

export default responseHandler;
