export interface DeckCreateResponseData {
	id?: string;
	message?: string;
    error?: string;
}

export interface DeckCreateResponseDto {
	statusCode: number;
    data: DeckCreateResponseData;
}