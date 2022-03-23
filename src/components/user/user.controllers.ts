import { Request, Response } from 'express';

const auth = async (req: Request, res: Response) => {
	const { email }: { email: string } = req.body;
};

export { auth };
