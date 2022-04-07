import { Request, Response } from 'express';

import IResponseMessage from '../../types/IResponseMessage';
import {
	calcAvgZingTime,
	fetchOutletMenu,
	getOutletDetails,
	getOutletFavItems,
	getOutletsOfCampus,
	setOutletAvailability,
} from './outlet.dal';

const getCampusOutlets = async (req: Request, res: Response) => {
	const campusId: string = req.params.campusid;

	const outlets: IResponseMessage = await getOutletsOfCampus({ campusId });

	return res.status(outlets.statusCode).json({ response: outlets });
};

const getOutlet = async (req: Request, res: Response) => {
	const outletId: string = req.params.outletid;

	const outlet: IResponseMessage = await getOutletDetails({
		outletId,
	});

	return res.status(outlet.statusCode).json({ response: outlet });
};

const getOutletMenu = async (req: Request, res: Response) => {
	const outletId: string = req.params.outletid;

	const outletMenu: IResponseMessage = await fetchOutletMenu({
		outletId,
	});

	return res.status(outletMenu.statusCode).json({ response: outletMenu });
};

const getAvgZingTime = async (req: Request, res: Response) => {
	const outletId: string = req.params.outletid;

	const zingTime: IResponseMessage = await calcAvgZingTime({
		outletId,
	});

	return res.status(zingTime.statusCode).json({ response: zingTime });
};

const getOutletFavs = async (req: Request, res: Response) => {
	const outletId: string = req.params.outletid;

	const favItems: IResponseMessage = await getOutletFavItems({
		outletId,
	});

	return res.status(favItems.statusCode).json({ response: favItems });
};

const setAvailability = async (req: Request, res: Response) => {
	const { loggedInUser } = res.locals;
	const userId = loggedInUser._id;

	const setMode = req.query.set;
	const outletId = req.params.outletid;

	const outletResponse = await setOutletAvailability({
		userId,
		outletId,
		setMode,
	});

	return res
		.status(outletResponse.statusCode)
		.json({ response: outletResponse });
};

export {
	getCampusOutlets,
	getOutletMenu,
	getOutlet,
	getAvgZingTime,
	getOutletFavs,
	setAvailability,
};
