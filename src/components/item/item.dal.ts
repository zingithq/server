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

export default isItemAvailable;
