import { DomainError } from './domain-error';

export class ForbiddenError extends DomainError {
  constructor() {
    super({
      code: 'FORBIDDEN',
      message: 'You do not have permission to do this action',
      statusCode: 403,
      details: {},
    });
  }
}