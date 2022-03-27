const uniqueCodes = {
	reqOriginRequired: {
		code: 'REQ_ORIGIN_REQUIRED',
		status: 403,
		message: 'Request origin is required',
	},
	reqOriginInvalid: {
		code: 'REQ_ORIGIN_INVALID',
		status: 403,
		message: 'Request origin is invalid',
	},
	reqOriginExpired: {
		code: 'REQ_ORIGIN_EXPIRED',
		status: 403,
		message: 'Request origin is expired',
	},
	appTypeNotValid: {
		code: 'APP_TYPE_NOT_VALID',
		status: 400,
		message: 'App type is not valid',
	},
	appTypeRequired: {
		code: 'APP_TYPE_REQUIRED',
		status: 400,
		message: 'App type is required',
	},
	appTypeValid: {
		code: 'APP_TYPE_VALID',
		status: 200,
		message: 'App type is valid',
	},
	emailRequired: {
		code: 'EMAIL_REQUIRED',
		status: 400,
		message: 'Email is required',
	},
	emailNotValid: {
		code: 'EMAIL_NOT_VALID',
		status: 400,
		message: 'Email is not valid',
	},
	emailValid: {
		code: 'EMAIL_VALID',
		status: 200,
		message: 'Email is valid',
	},
	internalServerError: {
		code: 'INTERNAL_SERVER_ERROR',
		status: 500,
		message: 'Internal server error',
	},
	campusDomainRequired: {
		code: 'CAMPUS_DOMAIN_REQUIRED',
		status: 400,
		message: 'Campus email domain is required',
	},
	campusNotFound: {
		code: 'CAMPUS_NOT_FOUND',
		status: 404,
		message: 'Campus not found',
	},
	campusFound: {
		code: 'CAMPUS_FOUND',
		status: 200,
		message: 'Campus found',
	},
	emailOrUserIdRequired: {
		code: 'EMAIL_OR_USER_ID_REQUIRED',
		status: 400,
		message: 'Email or user id is required',
	},
	userNotFound: {
		code: 'USER_NOT_FOUND',
		status: 404,
		message: 'User not found',
	},
	userFound: {
		code: 'USER_FOUND',
		status: 200,
		message: 'User found',
	},
	userFullNameRequired: {
		code: 'USER_FULL_NAME_REQUIRED',
		status: 400,
		message: 'User full name is required',
	},
	userCreated: {
		code: 'USER_CREATED',
		status: 200,
		message: 'User created',
	},
	unauthorized: {
		code: 'UNAUTHORIZED',
		status: 401,
		message: 'Token unauthorized',
	},
};

export default uniqueCodes;
