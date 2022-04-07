interface IResponseMessage {
	message: string;
	statusCode: number;
	uniqueCode: string;
	data: { type: string; payload: unknown };
	functionName: string | null;
	responseCode: number;
}

export default IResponseMessage;
