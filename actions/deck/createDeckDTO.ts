export interface IDeckCreateResponseData {
	id?: string;
	message?: string;
    error?: string;
}

export interface IDeckCreateResponseDto {
	statusCode: number;
    data: IDeckCreateResponseData;
}