import User from './user.model';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import emailValidator from '../../helpers/emailValidator';
import { getCampusFromDomain } from '../campus/campus.dal';
import uniqueCodes from '../../constants/uniqueCodes';
import signJwt from '../../helpers/signJwt';
import appTypeValidator from '../../helpers/appTypeValidator';
import IUserModel from '../../types/IUserModel';
import ICampusModel from '../../types/ICampusModel';

const getUserWithEmailOrId = async (contextObject: {
	email: string | null;
	userId: string | null;
	appType: string;
}): Promise<IResponseMessage> => {
	const { email, appType, userId } = contextObject;

	if ((!email || !email.trim()) && (!userId || !userId.trim())) {
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

	let cleanEmail: string | null = null;
	if (email && email.trim()) {
		cleanEmail = email.trim();
		cleanEmail = cleanEmail.toLowerCase();
	}

	let cleanUserId: string | null = null;
	if (userId && userId.trim()) {
		cleanUserId = userId.trim();
		cleanUserId = cleanUserId.toLowerCase();
	}

	const appValidation = appTypeValidator(appType);
	if (appValidation.data.type === 'error') {
		return new Promise((resolve) => resolve(appValidation));
	}

	const appTypeFinal = appValidation.data.payload as string;
	const userRole = appTypeFinal === 'zing_consumer' ? 'consumer' : 'owner';

	try {
		const user: IUserModel | null = await User.findOne({
			$or: [{ userEmail: cleanEmail }, { _id: cleanUserId }],
			userRole,
		}).select('-_v');

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

const createConsumer = async (contextObject: {
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

	if (appType !== 'zing_consumer') {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.appTypeNotValid,
					data: { type: 'error', payload: null },
					functionName: 'createConsumer',
				})
			)
		);
	}

	if (!userFullName || !userFullName.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.userFullNameRequired,
					data: { type: 'error', payload: null },
					functionName: 'createConsumer',
				})
			)
		);
	}

	let userFullNameClean = userFullName.trim();
	userFullNameClean = userFullNameClean.toLowerCase();

	const userEmailDomain = emailFinal.split('@')[1];
	const getCampusExistance: IResponseMessage = await getCampusFromDomain({
		campusEmailDomain: userEmailDomain,
	});

	if (getCampusExistance.data.type === 'error') {
		return getCampusExistance;
	}

	const { _id } = getCampusExistance.data.payload as ICampusModel;
	const campusId = _id;

	try {
		const newConsumer: IUserModel = await User.create({
			userEmail: emailFinal,
			userFullName: userFullNameClean,
			userRole: 'consumer',
			campusId,
		});

		if (!newConsumer) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.userNotCreated,
						data: { type: 'error', payload: null },
						functionName: 'createConsumer',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.userCreated,
					data: { type: 'success', payload: newConsumer },
					functionName: 'createConsumer',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'createConsumer',
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

	const userWithEmail: IResponseMessage = await getUserWithEmailOrId({
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

			const newConsumer: IResponseMessage = await createConsumer({
				email,
				userFullName,
				appType,
			});

			const consumerObj = newConsumer.data.payload as IUserModel;

			const signJwtResponse: string = signJwt({
				email: consumerObj.userEmail,
				_id: consumerObj._id,
			});

			newConsumer.data.payload = {
				user: newConsumer.data.payload,
				token: signJwtResponse,
			};

			return newConsumer;
		}
		return userWithEmail;
	}

	const userObj = userWithEmail.data.payload as IUserModel;

	const signJwtResponse: string = signJwt({
		email: userObj.userEmail,
		_id: userObj._id,
	});

	userWithEmail.data.payload = {
		user: userWithEmail.data.payload,
		token: signJwtResponse,
	};

	return userWithEmail;
};

const getLoggedInUser = async (contextObject: {
	appType: string;
	loggedInUser: IUserModel;
}): Promise<IResponseMessage> => {
	const { appType, loggedInUser } = contextObject;

	const appValidation: IResponseMessage = appTypeValidator(appType);
	if (appValidation.data.type === 'error') {
		return new Promise((resolve) => resolve(appValidation));
	}

	const userRole =
		loggedInUser.userRole === 'consumer' ? 'zing_consumer' : 'zing_owner';

	if (userRole !== appType) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.appTypeNotValid,
					data: { type: 'error', payload: null },
					functionName: 'getLoggedInUser',
				})
			)
		);
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

export { userAuth, getUserWithEmailOrId, createConsumer, getLoggedInUser };
