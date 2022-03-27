import IUniqueCode from './IUniqueCode';

interface IResponseParams {
	uniqueCodeData: IUniqueCode;
	data: { type: string; payload: unknown };
	functionName: string | null;
}

export default IResponseParams;
