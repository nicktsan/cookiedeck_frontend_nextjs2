'use server';
import { MakeApiRequest } from '@/services/baseApiRequest';
import {
  DeckUpdateIncrementviewRequestDTO,
  DeckUpdateIncrementviewResponseDataDTO,
  DeckUpdateIncrementviewResponseDTO,
} from './deck-update-incrementview.dto';
import {
  DeckUpdateIncrementviewRequestSchema,
  DeckUpdateIncrementviewResponseDataSchema,
  DeckUpdateIncrementviewResponseSchema,
} from './deck-update-incrementview.schema';
import { validate } from '@/utils/schemaValidator';
import { ENV } from '@/env';
// import { ErrorResponseDataDTO, ErrorResponseDataSchema, ErrorResponseDTO } from '@/utils/error.schema';
import { ZodError } from 'zod';
// import { AxiosError } from 'axios';
import { ResponseError } from '@/utils/responseError';

// const isDeckUpdateIncrementviewResponseDTO = (obj: any): obj is DeckUpdateIncrementviewResponseDTO => {
//   return (
//     typeof obj === 'object' &&
//     obj !== null &&
//     'statusCode' in obj &&
//     typeof obj.statusCode === 'number' &&
//     'data' in obj &&
//     typeof obj.data === 'object' &&
//     obj.data !== null &&
//     'id' in obj.data &&
//     typeof obj.data.id === 'string'
//   );
// };

//can use this as an example for error handling
export async function IncrementDeckView(
  deckUpdateIncrementviewRequestData: DeckUpdateIncrementviewRequestDTO,
): Promise<DeckUpdateIncrementviewResponseDataDTO> {
  try {
    // console.log("IncrementDeckView triggered.")
    const deckUpdateIncrementviewUrl = ENV.BACKEND_URL + '/deck/update/incrementview';
    // console.log("deckUpdateIncrementviewUrl: ", deckUpdateIncrementviewUrl)
    // console.log('deckUpdateIncrementviewRequestData: ', deckUpdateIncrementviewRequestData);
    const deckUpdateIncrementviewResponse: DeckUpdateIncrementviewResponseDTO | ResponseError | ZodError | Error = await MakeApiRequest({
      url: deckUpdateIncrementviewUrl,
      method: 'PATCH',
      requestSchema: DeckUpdateIncrementviewRequestSchema,
      responseSchema: DeckUpdateIncrementviewResponseSchema,
      data: deckUpdateIncrementviewRequestData,
    });
    
    // console.log("raw deckUpdateIncrementviewResponse: ", deckUpdateIncrementviewResponse);
    // if (isDeckUpdateIncrementviewResponseDTO(deckUpdateIncrementviewResponse)){
      
    // }
    if (deckUpdateIncrementviewResponse instanceof ResponseError|| deckUpdateIncrementviewResponse instanceof ZodError || deckUpdateIncrementviewResponse instanceof Error) {
      throw deckUpdateIncrementviewResponse;
    } 
    const validated: DeckUpdateIncrementviewResponseDataDTO = validate(
      deckUpdateIncrementviewResponse.data,
      DeckUpdateIncrementviewResponseDataSchema,
      'DeckUpdateIncrementviewResponseDataSchema',
    );
    // console.log("validated deckUpdateIncrementviewResponse: ", validated);
    return validated;
    // console.log("validating ErrorResponseDataDTO")
    //todo create a custom error type and throw it.
    // const validatedError: ErrorResponseDataDTO = validate(
    //   deckUpdateIncrementviewResponse.data,
    //   ErrorResponseDataSchema,
    //   'ErrorResponseDataSchema',
    // );
    // // console.log("validation of ErrorResponseDataDTO completed")
    // throw validatedError;
  } catch (error) {
    throw error
  }
}
