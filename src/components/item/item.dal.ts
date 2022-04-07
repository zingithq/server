import Item from './item.model';
import uniqueCodes from '../../constants/uniqueCodes';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import IItemModel from '../../types/IItemModel';

const isItemAvailable = async (contextObj: {
	itemId: string;
}): Promise<IResponseMessage> => {
	const { itemId } = contextObj;

	if (!itemId || !itemId.trim()) {
		return new Promise((resolve) => {
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidItemId,
					functionName: 'isItemAvailable',
					data: { type: 'error', payload: null },
				})
			);
		});
	}

	const itemIdClean = itemId.trim();

	try {
		const item: IItemModel | null = await Item.findOne({
			_id: itemIdClean,
			isAvailable: true,
		});

		if (!item) {
			return new Promise((resolve) => {
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.itemNotAvailable,
						functionName: 'isItemAvailable',
						data: { type: 'error', payload: null },
					})
				);
			});
		}

		return new Promise((resolve) => {
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.itemAvailable,
					functionName: 'isItemAvailable',
					data: { type: 'success', payload: item },
				})
			);
		});
	} catch (err) {
		return new Promise((resolve) => {
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					functionName: 'isItemAvailable',
					data: { type: 'error', payload: null },
				})
			);
		});
	}
};

const fetchItemDetails = async (contextObj: {
	itemId: string;
}): Promise<IResponseMessage> => {
	const { itemId } = contextObj;

	if (!itemId || !itemId.trim()) {
		return new Promise((resolve) => {
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidItemId,
					functionName: 'fetchItemDetails',
					data: { type: 'error', payload: null },
				})
			);
		});
	}

	const itemIdClean = itemId.trim();

	try {
		const item: IItemModel | null = await Item.findOne({
			_id: itemIdClean,
		});

		if (!item) {
			return new Promise((resolve) => {
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noItemsFound,
						functionName: 'fetchItemDetails',
						data: { type: 'error', payload: null },
					})
				);
			});
		}

		return new Promise((resolve) => {
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.itemsFound,
					functionName: 'fetchItemDetails',
					data: { type: 'success', payload: item },
				})
			);
		});
	} catch (err) {
		return new Promise((resolve) => {
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					functionName: 'fetchItemDetails',
					data: { type: 'error', payload: null },
				})
			);
		});
	}
};

const updateItemAvailability = async (contextObject: {
	availability: unknown;
	itemId: string;
}): Promise<IResponseMessage> => {
	const { availability, itemId } = contextObject;

	if (!itemId || !itemId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidItemId,
					data: { type: 'error', payload: null },
					functionName: 'updateItemAvailability',
				})
			)
		);
	}

	const cleanItemId = itemId.trim();

	if (
		typeof availability !== 'string' ||
		!availability ||
		!availability.trim() ||
		(availability !== 'true' && availability !== 'false')
	) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidSetMode,
					data: { type: 'error', payload: null },
					functionName: 'updateItemAvailability',
				})
			)
		);
	}

	const cleanSetMode = availability.trim().toLowerCase();

	try {
		const updatedItem = await Item.findOneAndUpdate(
			{
				_id: cleanItemId,
			},
			{
				$set: {
					isItemAvailable: cleanSetMode === 'true',
				},
			},
			{
				new: true,
			}
		);

		if (!updatedItem) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noItemsFound,
						data: { type: 'error', payload: null },
						functionName: 'updateItemAvailability',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.itemAvailabilitySet,
					data: { type: 'success', payload: updatedItem },
					functionName: 'updateItemAvailability',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'updateItemAvailability',
				})
			)
		);
	}
};

export { isItemAvailable, fetchItemDetails, updateItemAvailability };
