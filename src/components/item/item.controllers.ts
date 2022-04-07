import { Request, Response } from 'express';

import IResponseMessage from '../../types/IResponseMessage';
import { fetchItemDetails, updateItemAvailability } from './item.dal';

const getItemDetails = async (req: Request, res: Response) => {
	const itemId: string = req.params.itemid;

	const itemDetails: IResponseMessage = await fetchItemDetails({
		itemId,
	});
	return res.status(itemDetails.statusCode).json({ response: itemDetails });
};

const setItemAvailability = async (req: Request, res: Response) => {
	const itemId: string = req.params.itemid;

	const availability = req.query.available;

	const updatedItem: IResponseMessage = await updateItemAvailability({
		itemId,
		availability,
	});
	return res.status(updatedItem.statusCode).json({ response: updatedItem });
};

export { getItemDetails, setItemAvailability };
