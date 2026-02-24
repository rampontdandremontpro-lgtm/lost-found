import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

type FieldsErrorsMap = Record<string, string[]>;

function flattenToFieldsMap(errors: ValidationError[], parentPath = ''): FieldsErrorsMap {
  const fields: FieldsErrorsMap = {};

  for (const err of errors) {
    const fieldPath = parentPath ? `${parentPath}.${err.property}` : err.property;

    if (err.constraints) {
      fields[fieldPath] = Object.values(err.constraints);
    }

    if (err.children && err.children.length > 0) {
      const childFields = flattenToFieldsMap(err.children, fieldPath);

      for (const [key, value] of Object.entries(childFields)) {
        fields[key] = value;
      }
    }
  }

  return fields;
}

export function buildGlobalValidationPipe() {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: false,
    exceptionFactory: (errors) => {
      const fields = flattenToFieldsMap(errors);

      return new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        fields,
      });
    },
  });
}