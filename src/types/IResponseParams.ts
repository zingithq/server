interface IResponseParams {
	message: string;
	statusCode: number;
	uniqueCode: string;
	data: { type: string; payload: unknown };
	functionName: string | null;
}

export default IResponseParams;
