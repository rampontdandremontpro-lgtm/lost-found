import { DomainError } from "src/core/errors/domain-error";

export class ProfileNotFoundError extends DomainError {
  constructor(id: string) {
    super({
      code: 'PROFILE_NOT_FOUND',
      message: 'Profile not found',
      statusCode: 404,
      fields: { id: [id] },
      details: {},
    });
  }
}
