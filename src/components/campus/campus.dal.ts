import Campus from './campus.model';
import Item from '../item/item.model';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import uniqueCodes from '../../constants/uniqueCodes';
import ICampusModel from '../../types/ICampusModel';
import IItemModel from '../../types/IItemModel';

/**
 * @description - This function is used to check if a campus exists.
 * @returns - Returns error || campus object if it exists
 * @param {string} campusEmailDomain - The campus email domain(e.g. goa.bits-pilani.ac.in)
 */

const getCampusFromDomain = async (contextObject: {
	campusEmailDomain: string;
}): Promise<IResponseMessage> => {
	const { campusEmailDomain } = contextObject;

	if (!campusEmailDomain || !campusEmailDomain.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.campusDomainRequired,
					data: { type: 'error', payload: null },
					functionName: 'getCampusFromDomain',
				})
			)
		);
	}

	let cleanCampusEmailDomain = campusEmailDomain.trim();
	cleanCampusEmailDomain = cleanCampusEmailDomain.toLowerCase();

	try {
		const campus: ICampusModel | null = await Campus.findOne({
			campusEmailDomain: cleanCampusEmailDomain,
		}).select('-_v');

		if (!campus) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.campusNotFound,
						data: { type: 'error', payload: null },
						functionName: 'getCampusFromDomain',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.campusFound,
					data: { type: 'success', payload: campus },
					functionName: 'getCampusFromDomain',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'getCampusFromDomain',
				})
			)
		);
	}
};

const fetchCampusFavorites = async (contextObject: {
	campusId: string;
}): Promise<IResponseMessage> => {
	const { campusId } = contextObject;

	if (!campusId || !campusId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.invalidCampusId,
					data: { type: 'error', payload: null },
					functionName: 'fetchCampusFavorites',
				})
			)
		);
	}

	const campusIdClean: string = campusId.trim();
	try {
		const favItems: Array<IItemModel> | null = await Item.find({
			campusId: campusIdClean,
			isFav: true,
		}).select('-_v');

		if (!favItems || !favItems.length) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.noItemsFound,
						data: { type: 'error', payload: null },
						functionName: 'fetchCampusFavorites',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.campusFound,
					data: { type: 'success', payload: favItems },
					functionName: 'fetchCampusFavorites',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'fetchCampusFavorites',
				})
			)
		);
	}
};

const getCampusFromId = async (contextObject: {
	campusId: string;
}): Promise<IResponseMessage> => {
	const { campusId } = contextObject;

	if (!campusId || !campusId.trim()) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.campusDomainRequired,
					data: { type: 'error', payload: null },
					functionName: 'getCampusFromDomain',
				})
			)
		);
	}

	const cleanCampusId = campusId.trim();

	try {
		const campus: ICampusModel | null = await Campus.findById(
			cleanCampusId
		).select('-_v');

		if (!campus) {
			return new Promise((resolve) =>
				resolve(
					responseHandler({
						uniqueCodeData: uniqueCodes.campusNotFound,
						data: { type: 'error', payload: null },
						functionName: 'getCampusFromDomain',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.campusFound,
					data: { type: 'success', payload: campus },
					functionName: 'getCampusFromDomain',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					uniqueCodeData: uniqueCodes.internalServerError,
					data: { type: 'error', payload: null },
					functionName: 'getCampusFromDomain',
				})
			)
		);
	}
};

export { getCampusFromDomain, fetchCampusFavorites, getCampusFromId };
