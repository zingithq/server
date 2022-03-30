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
		status: 403,
		message: 'App type is not valid',
	},
	appTypeRequired: {
		code: 'APP_TYPE_REQUIRED',
		status: 403,
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
	invalidUserId: {
		code: 'INVALID_USER_ID',
		status: 400,
		message: 'Invalid user id',
	},
	invalidItemId: {
		code: 'INVALID_ITEM_ID',
		status: 400,
		message: 'Invalid item id',
	},
	itemNotAvailable: {
		code: 'ITEM_NOT_AVAILABLE',
		status: 404,
		message: 'Item not available',
	},
	itemAvailable: {
		code: 'ITEM_AVAILABLE',
		status: 200,
		message: 'Item available',
	},
	unprocessable: {
		code: 'UNPROCESSABLE',
		status: 422,
		message: 'Request unprocessable',
	},
	userNotCreated: {
		code: 'USER_NOT_CREATED',
		status: 400,
		message: 'User not created',
	},
	invalidCart: {
		code: 'INVALID_CART',
		status: 400,
		message: 'Invalid cart',
	},
	invalidOutletId: {
		code: 'INVALID_OUTLET_ID',
		status: 400,
		message: 'Invalid outlet id',
	},
	invalidQuantity: {
		code: 'INVALID_QUANTITY',
		status: 400,
		message: 'Invalid quantity',
	},
	cartNotUpdated: {
		code: 'CART_NOT_UPDATED',
		status: 400,
		message: 'Cart not updated',
	},
	cartUpdated: {
		code: 'CART_UPDATED',
		status: 200,
		message: 'Cart updated',
	},
	itemAddedToCart: {
		code: 'ITEM_ADDED_TO_CART',
		status: 200,
		message: 'Item added to cart',
	},
	itemRemovedFromCart: {
		code: 'ITEM_REMOVED_FROM_CART',
		status: 200,
		message: 'Item removed from cart',
	},
	cartCleared: {
		code: 'CART_CLEARED',
		status: 200,
		message: 'Cart cleared',
	},
};

export default uniqueCodes;
