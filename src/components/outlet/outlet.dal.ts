import Outlet from './outlet.model';
import Item from '../item/item.model';
import Order from '../order/order.model';
import uniqueCodes from '../../constants/uniqueCodes';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import IOutletModel from '../../types/IOutletModel';
import IItemModel from '../../types/IItemModel';
import IOrderModel from '../../types/IOrderModel';

const calcAvgZingTime = async (contextObject: {
	outletId: string;
}): Promise<IResponseMessage> => {
	const { outletId } = contextObject;

	if (!outletId || !outletId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidOutletId,
					data: { type: 'error', payload: null },
					functionName: 'calcAvgZingTime',
				})
			)
		);
	}

	const cleanOutletId = outletId.trim();

	try {
		const lastOrders: Array<IOrderModel> | null = await Order.find({
			outletId: cleanOutletId,
			orderStatus: 'accepted prepared timer_expired collected',
		})
			.limit(7)
			.sort({ createdAt: -1 })
			.select('-_v');

		if (!lastOrders || !lastOrders.length) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noOrdersFound,
						data: { type: 'error', payload: null },
						functionName: 'calcAvgZingTime',
					})
				)
			);
		}

		const zingTimes = lastOrders.map((order) => order.orderZingTime as number);

		const avgZingTime =
			zingTimes.reduce((acc, curr) => acc + curr, 0) / zingTimes.length;

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.avgZingTimeCalculated,
					data: { type: 'success', payload: avgZingTime },
					functionName: 'calcAvgZingTime',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'calcAvgZingTime',
				})
			)
		);
	}
};

const getOutletsOfCampus = async (contextObject: {
	campusId: string;
}): Promise<IResponseMessage> => {
	const { campusId } = contextObject;

	if (!campusId || !campusId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidCampusId,
					data: { type: 'error', payload: null },
					functionName: 'getOutletsOfCampus',
				})
			)
		);
	}

	const cleanCampusId = campusId.trim();

	try {
		const outlets: Array<IOutletModel> | null = await Outlet.find({
			campusId: cleanCampusId,
		}).select('-_v');

		if (!outlets || !outlets.length) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noOutletsFound,
						data: { type: 'error', payload: null },
						functionName: 'getOutletsOfCampus',
					})
				)
			);
		}

		// const outletsWithZingTime = await Promise.all(
		// 	outlets.map(async (outlet) => {
		// 		const outletId = outlet._id;

		// 		const avgZingTime = await calcAvgZingTime({ outletId });

		// 		if (avgZingTime.data.type === 'error') {
		// 			return 'error';
		// 		}

		// 		return { ...outlet.toObject(), avgZingTime };
		// 	})
		// );

		// if (outletsWithZingTime.includes('error')) {
		// 	return new Promise((resolve) =>
		// 		resolve(
		// 			responseHandler({
		// 				uniqueCodeData: uniqueCodes.internalServerError,
		// 				data: { type: 'error', payload: null },
		// 				functionName: 'getOutletsOfCampus',
		// 			})
		// 		)
		// 	);
		// }

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.outletsFound,
					data: { type: 'success', payload: outlets },
					functionName: 'getOutletsOfCampus',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'getOutletsOfCampus',
				})
			)
		);
	}
};

const getOutletDetails = async (contextObject: {
	outletId: string;
}): Promise<IResponseMessage> => {
	const { outletId } = contextObject;

	if (!outletId || !outletId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidOutletId,
					data: { type: 'error', payload: null },
					functionName: 'getOutletDetails',
				})
			)
		);
	}

	const cleanOutletId = outletId.trim();

	try {
		const outletDetails: IOutletModel | null = await Outlet.findById(
			cleanOutletId
		).select('-_v');

		if (!outletDetails) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noOutletFound,
						data: { type: 'error', payload: null },
						functionName: 'getOutletDetails',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.outletFound,
					data: { type: 'success', payload: outletDetails },
					functionName: 'getOutletDetails',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'getOutletDetails',
				})
			)
		);
	}
};

const fetchOutletMenu = async (contextObject: {
	outletId: string;
}): Promise<IResponseMessage> => {
	const { outletId } = contextObject;

	if (!outletId || !outletId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidOutletId,
					data: { type: 'error', payload: null },
					functionName: 'fetchOutletMenu',
				})
			)
		);
	}

	const cleanOutletId = outletId.trim();

	try {
		const menuItems: Array<IItemModel> | null = await Item.find({
			outletId: cleanOutletId,
		}).select('-_v');

		if (!menuItems || !menuItems.length) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noItemsFound,
						data: { type: 'error', payload: null },
						functionName: 'fetcheOutletMenu',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.itemsFound,
					data: { type: 'success', payload: menuItems },
					functionName: 'fetcheOutletMenu',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'fetchOutletMenu',
				})
			)
		);
	}
};

const getOutletFavItems = async (contextObject: {
	outletId: string;
}): Promise<IResponseMessage> => {
	const { outletId } = contextObject;

	if (!outletId || !outletId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidOutletId,
					data: { type: 'error', payload: null },
					functionName: 'getOutletFavItems',
				})
			)
		);
	}

	const cleanOutletId = outletId.trim();

	try {
		const favItems: Array<IItemModel> | null = await Item.find({
			outletId: cleanOutletId,
			isFav: true,
		}).select('-_v');

		if (!favItems || !favItems.length) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noItemsFound,
						data: { type: 'error', payload: null },
						functionName: 'getOutletFavItems',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.itemsFound,
					data: { type: 'success', payload: favItems },
					functionName: 'getOutletFavItems',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'getOutletFavItems',
				})
			)
		);
	}
};

const setOutletAvailability = async (contextObject: {
	userId: string;
	setMode: unknown;
	outletId: string;
}): Promise<IResponseMessage> => {
	const { userId, setMode, outletId } = contextObject;

	if (!userId || !userId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidUserId,
					data: { type: 'error', payload: null },
					functionName: 'setOutletAvailability',
				})
			)
		);
	}

	const cleanUserId = userId.trim();

	if (!outletId || !outletId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidOutletId,
					data: { type: 'error', payload: null },
					functionName: 'setOutletAvailability',
				})
			)
		);
	}

	const cleanOutletId = outletId.trim();

	if (
		typeof setMode !== 'string' ||
		!setMode ||
		!setMode.trim() ||
		(setMode !== 'open' && setMode !== 'close')
	) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidSetMode,
					data: { type: 'error', payload: null },
					functionName: 'setOutletAvailability',
				})
			)
		);
	}

	const cleanSetMode = setMode.trim().toLowerCase();

	try {
		const updatedOutlet = await Outlet.findOneAndUpdate(
			{
				_id: cleanOutletId,
				ownerId: cleanUserId,
			},
			{
				$set: {
					isOutletActive: cleanSetMode === 'open',
				},
			},
			{
				new: true,
			}
		);

		if (!updatedOutlet) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noOutletFound,
						data: { type: 'error', payload: null },
						functionName: 'setOutletAvailability',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.outletAvailabilitySet,
					data: { type: 'success', payload: updatedOutlet },
					functionName: 'setOutletAvailability',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'setOutletAvailability',
				})
			)
		);
	}
};

export {
	getOutletsOfCampus,
	fetchOutletMenu,
	getOutletDetails,
	calcAvgZingTime,
	getOutletFavItems,
	setOutletAvailability,
};
