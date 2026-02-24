import { DomainError } from "src/core/errors/domain-error";

export class EmailAlreadyUsedError extends DomainError {
  constructor(email: string) {
    super({
      code: 'EMAIL_ALREADY_USED',
      message: 'Email already used',
      statusCode: 409,
      fields: { email: [email] },
      details: {},
    });
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials',
      statusCode: 401,
      fields: {},
      details: {},
    });
  }
}
