import User from './user.model';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import emailValidator from '../../helpers/emailValidator';
import checkCampusExistance from '../campus/campus.dal';

const getUserWithEmailOrId = async (contextObject: {
	email: string | null;
	userId: string | null;
	appType: string;
}): Promise<IResponseMessage> => {
	const { email, appType, userId } = contextObject;

	let cleanEmail = email?.trim();
	cleanEmail = cleanEmail?.toLowerCase();

	let cleanUserId = userId?.trim();
	cleanUserId = cleanUserId?.toLowerCase();

	if (!cleanEmail && !cleanUserId) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 400,
					message: 'Email or user id is required',
					uniqueCode: 'EMAIL_OR_USER_ID_REQUIRED',
					data: { type: 'error', payload: null },
					functionName: 'getUserWithEmailOrId',
				})
			)
		);
	}

	try {
		const user: unknown = await User.findOne({
			$or: [{ userEmail: cleanEmail }, { _id: cleanUserId }],
			userRole: appType === 'zing_owner' ? 'owner' : 'student',
		});

		if (!user) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						statusCode: 404,
						message: 'User not found',
						uniqueCode: 'USER_NOT_FOUND',
						data: { type: 'error', payload: null },
						functionName: 'getUserWithEmailOrId',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 200,
					message: 'User found',
					uniqueCode: 'USER_FOUND',
					data: { type: 'success', payload: user },
					functionName: 'getUserWithEmailOrId',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 500,
					message: 'Internal server error',
					uniqueCode: 'INTERNAL_SERVER_ERROR',
					data: { type: 'error', payload: null },
					functionName: 'getUserWithEmailOrId',
				})
			)
		);
	}
};

const createStudent = async (contextObject: {
	email: string;
	userFullName: string;
	appType: string;
}): Promise<IResponseMessage> => {
	const { email, userFullName, appType } = contextObject;

	const emailValidation: IResponseMessage = emailValidator(email);
	if (emailValidation.data.type === 'error') {
		return new Promise((resolve) => resolve(emailValidation));
	}

	const emailFinal = emailValidation.data.payload as string;

	if (appType !== 'zing_student') {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 400,
					message: 'Invalid app type',
					uniqueCode: 'INVALID_APP_TYPE',
					data: { type: 'error', payload: null },
					functionName: 'createStudent',
				})
			)
		);
	}

	let userFullNameClean = userFullName.trim();
	userFullNameClean = userFullNameClean.toLowerCase();

	if (!userFullNameClean) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 400,
					message: 'User full name is required',
					uniqueCode: 'USER_FULL_NAME_REQUIRED',
					data: { type: 'error', payload: null },
					functionName: 'createStudent',
				})
			)
		);
	}

	const userEmailDomain: string = emailFinal.split('@')[1];
	const getCampusExistance: IResponseMessage = await checkCampusExistance({
		campusEmailDomain: userEmailDomain,
	});

	if (getCampusExistance.data.type === 'error') {
		return getCampusExistance;
	}

	const { _id } = getCampusExistance.data.payload as Record<string, unknown>;
	const campusId = _id;

	try {
		const newStudent: unknown = await User.create({
			userEmail: email,
			userFullName,
			userRole: 'student',
			campusId,
		});

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 201,
					message: 'User created',
					uniqueCode: 'USER_CREATED',
					data: { type: 'success', payload: newStudent },
					functionName: 'createStudent',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 500,
					message: 'Internal server error',
					uniqueCode: 'INTERNAL_SERVER_ERROR',
					data: { type: 'error', payload: null },
					functionName: 'createStudent',
				})
			)
		);
	}
};

const userAuth = async (contextObject: {
	appType: string;
	email: string;
	userFullName: string;
}): Promise<IResponseMessage> => {
	const { appType, email, userFullName } = contextObject;

	const userWithEmail = await getUserWithEmailOrId({
		email,
		userId: null,
		appType,
	});
	if (userWithEmail.data.type === 'error') {
		if (userWithEmail.uniqueCode === 'USER_NOT_FOUND') {
			if (appType === 'zing_owner') {
				return new Promise((resolve) =>
					resolve(
						responseHandler({
							statusCode: 404,
							message: 'User not found',
							uniqueCode: 'USER_NOT_FOUND',
							data: { type: 'error', payload: null },
							functionName: 'userAuth',
						})
					)
				);
			}

			const newStudent: IResponseMessage = await createStudent({
				email,
				userFullName,
				appType,
			});

			return newStudent;
		}
		return userWithEmail;
	}

	return userWithEmail;
};

export { userAuth, getUserWithEmailOrId };
