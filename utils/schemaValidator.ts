import { IDTO } from '@/services/baseDTO';
import { z, ZodIssue, ZodSchema } from 'zod';

interface ValidateConfig<T extends z.ZodTypeAny> {
  dto: unknown; //res.data
  schema: T; //data schema
  schemaName: string;
}
export function validate<T extends z.ZodTypeAny>(
  dto: unknown,
  schema: T,
  schemaName: string,
): z.infer<T> {
  return ValidateSchema({ dto, schema, schemaName });
}

export function ValidateSchema<T extends z.ZodTypeAny>(config: ValidateConfig<T>): z.infer<T> {
  const { data, success, error } = config.schema.safeParse(config.dto);

  if (success) {
    return data;
  } else {
    captureError(`API Validation Error: ${config.schemaName}`, {
      dto: config.dto,
      error: error.message,
      issues: error.issues,
    });

    throw error;
  }
}

function captureError(message: string, extra = {}): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, extra);
  } else {
    // TODO: report to Sentry/something else
  }
}
