import Campus from './campus.model';
import IResponseMessage from '../../types/IResponseMessage';
import responseHandler from '../../utils/responseHandler';

/**
 * @description - This function is used to check if a campus exists.
 * @returns - Returns error || campus object if it exists
 * @param {string} campusEmailDomain - The campus email domain(e.g. goa.bits-pilani.ac.in)
 */

const checkCampusExistance = async (contextObject: {
	campusEmailDomain: string;
}): Promise<IResponseMessage> => {
	const { campusEmailDomain } = contextObject;

	let cleanCampusEmailDomain = campusEmailDomain.trim();
	cleanCampusEmailDomain = cleanCampusEmailDomain.toLowerCase();

	if (!cleanCampusEmailDomain) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 400,
					message: 'Campus email domain is required',
					uniqueCode: 'CAMPUS_EMAIL_DOMAIN_REQUIRED',
					data: { type: 'error', payload: null },
					functionName: 'checkCampusExistance',
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
						statusCode: 404,
						message: 'Campus does not exist',
						uniqueCode: 'CAMPUS_DOES_NOT_EXIST',
						data: { type: 'error', payload: null },
						functionName: 'checkCampusExistance',
					})
				)
			);
		}

		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 200,
					message: 'Campus exists',
					uniqueCode: 'CAMPUS_EXISTS',
					data: { type: 'success', payload: campus },
					functionName: 'checkCampusExistance',
				})
			)
		);
	} catch (err) {
		return new Promise((resolve) =>
			resolve(
				responseHandler({
					statusCode: 500,
					message: 'Internal server error',
					uniqueCode: 'INTERNAL_SERVER_ERROR',
					data: { type: 'error', payload: null },
					functionName: 'checkCampusExistance',
				})
			)
		);
	}
};

export default checkCampusExistance;
