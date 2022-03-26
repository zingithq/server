import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {};

export default verifyToken;
