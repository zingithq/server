import { Request, Response } from 'express';

import IResponseMessage from '../../types/IResponseMessage';
import { fetchCampusFavorites, getCampusFromId } from './campus.dal';

const getCampusFavorites = async (req: Request, res: Response) => {
	const campusId: string = req.params.campusid;

	const campusFavorites: IResponseMessage = await fetchCampusFavorites({
		campusId,
	});
	return res
		.status(campusFavorites.statusCode)
		.json({ response: campusFavorites });
};

const getCampusDetails = async (req: Request, res: Response) => {
	const campusId: string = req.params.campusid;

	const campusDetails: IResponseMessage = await getCampusFromId({
		campusId,
	});
	return res.status(campusDetails.statusCode).json({ response: campusDetails });
};

export { getCampusFavorites, getCampusDetails };
