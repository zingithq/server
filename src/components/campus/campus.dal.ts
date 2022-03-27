import Campus from './campus.model';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';
import uniqueCodes from '../../constants/uniqueCodes';

/**
 * @description - This function is used to check if a campus exists.
 * @returns - Returns error || campus object if it exists
 * @param {string} campusEmailDomain - The campus email domain(e.g. goa.bits-pilani.ac.in)
 */

const getCampusFromDomain = async (contextObject: {
	campusEmailDomain: string;
}): Promise<IResponseMessage> => {
	const { campusEmailDomain } = contextObject;

	let cleanCampusEmailDomain = campusEmailDomain.trim();
	cleanCampusEmailDomain = cleanCampusEmailDomain.toLowerCase();

	if (!cleanCampusEmailDomain) {
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

	try {
		const campus: unknown = await Campus.findOne({
			campusEmailDomain: cleanCampusEmailDomain,
		});

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

export default getCampusFromDomain;
