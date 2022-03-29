import { Request, Response } from 'express';

import IResponseMessage from '../../types/IResponseMessage';
import {
	addItemToCart,
	clearUserCart,
	getUserCart,
	removeItemFromCart,
} from './cart.dal';

const getCart = async (req: Request, res: Response) => {
	const { loggedInUser } = res.locals;
	const userId = loggedInUser._id;

	const cart: IResponseMessage = await getUserCart({ userId });

	return res.status(cart.statusCode).json({ response: cart });
};

const addItem = async (req: Request, res: Response) => {
	const { loggedInUser } = res.locals;
	const userId = loggedInUser._id;

	const addedItemResponse: IResponseMessage = await addItemToCart({
		userId,
		body: req.body,
	});

	return res
		.status(addedItemResponse.statusCode)
		.json({ response: addedItemResponse });
};

const removeItem = async (req: Request, res: Response) => {
	const { loggedInUser } = res.locals;
	const userId = loggedInUser._id;

	const removedItemResponse: IResponseMessage = await removeItemFromCart({
		userId,
		body: req.body,
	});

	return res
		.status(removedItemResponse.statusCode)
		.json({ response: removedItemResponse });
};

const clearCart = async (req: Request, res: Response) => {
	const { loggedInUser } = res.locals;
	const userId = loggedInUser._id;

	const clearedCartResponse: IResponseMessage = await clearUserCart({ userId });

	return res
		.status(clearedCartResponse.statusCode)
		.json({ response: clearedCartResponse });
};

export { getCart, addItem, removeItem, clearCart };
