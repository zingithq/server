import { Request, Response } from 'express';

import IResponseMessage from '../../types/IResponseMessage';
import { getLoggedInUser, userAuth } from './user.dal';

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

const loggedUser = async (req: Request, res: Response) => {
	const { appType, loggedInUser } = res.locals;

	const userWithEmail = await getLoggedInUser({
		appType,
		loggedInUser,
	});

	return res.status(userWithEmail.statusCode).json({ response: userWithEmail });
};

export { auth, loggedUser };
