import User from './user.model';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import emailValidator from '../../helpers/emailValidator';
import getCampusFromDomain from '../campus/campus.dal';
import uniqueCodes from '../../constants/uniqueCodes';
import signJwt from '../../helpers/signJwt';
import appTypeValidator from '../../helpers/appTypeValidator';

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
					uniqueCodeData: uniqueCodes.emailOrUserIdRequired,
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
						uniqueCodeData: uniqueCodes.userNotFound,
						data: { type: 'error', payload: null },
						functionName: 'getUserWithEmailOrId',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.userFound,
					data: { type: 'success', payload: user },
					functionName: 'getUserWithEmailOrId',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
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
					uniqueCodeData: uniqueCodes.appTypeNotValid,
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
					uniqueCodeData: uniqueCodes.userFullNameRequired,
					data: { type: 'error', payload: null },
					functionName: 'createStudent',
				})
			)
		);
	}

	const userEmailDomain: string = emailFinal.split('@')[1];
	const getCampusExistance: IResponseMessage = await getCampusFromDomain({
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
					uniqueCodeData: uniqueCodes.userCreated,
					data: { type: 'success', payload: newStudent },
					functionName: 'createStudent',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
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
		if (userWithEmail.uniqueCode === uniqueCodes.userNotFound.code) {
			if (appType === 'zing_owner') {
				return new Promise((resolve) =>
					resolve(
						responseHandler({
							uniqueCodeData: uniqueCodes.userNotFound,
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

			const studentObj = newStudent.data.payload as Record<string, unknown>;

			const signJwtResponse: string = signJwt({
				email: studentObj.userEmail as string,
				_id: studentObj._id as string,
			});

			newStudent.data.payload = {
				user: newStudent.data.payload,
				token: signJwtResponse,
			};

			return newStudent;
		}
		return userWithEmail;
	}

	const userObj = userWithEmail.data.payload as Record<string, unknown>;

	const signJwtResponse: string = signJwt({
		email: userObj.userEmail as string,
		_id: userObj._id as string,
	});

	userWithEmail.data.payload = {
		user: userWithEmail.data.payload,
		token: signJwtResponse,
	};

	return userWithEmail;
};

const getLoggedInUser = async (contextObject: {
	appType: string;
	loggedInUser: unknown;
}): Promise<IResponseMessage> => {
	const { appType, loggedInUser } = contextObject;

	const appValidation = appTypeValidator(appType);
	if (appValidation.data.type === 'error') {
		return appValidation;
	}

	return new Promise((resolve) =>
		resolve(
			responseHandler({
				uniqueCodeData: uniqueCodes.userFound,
				data: { type: 'success', payload: loggedInUser },
				functionName: 'getLoggedInUser',
			})
		)
	);
};

export { userAuth, getUserWithEmailOrId, createStudent, getLoggedInUser };
