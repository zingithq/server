import { Request, Response } from 'express';
import IResponseMessage from '../../types/IResponseMessage';
import { getUserWithEmailOrId, userAuth } from './user.dal';

const auth = async (req: Request, res: Response) => {
	const { appType } = res.locals;
	const { email, userFullName }: { email: string; userFullName: string } =
		req.body;

	const userAuthResponse: IResponseMessage = await userAuth({
		appType,
		email,
		userFullName,
	});

	return res
		.status(userAuthResponse.statusCode)
		.json({ response: userAuthResponse });
};

const getLoggedInUser = async (req: Request, res: Response) => {
	const { appType, userId } = res.locals;

	const userWithEmail = await getUserWithEmailOrId({
		email: null,
		userId,
		appType,
	});

	return res.status(userWithEmail.statusCode).json({ response: userWithEmail });
};

export { auth, getLoggedInUser };
