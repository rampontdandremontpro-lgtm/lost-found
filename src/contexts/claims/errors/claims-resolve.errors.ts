import { DomainError } from 'src/core/errors/domain-error';

export class ClaimNotFoundError extends DomainError {
  constructor(claimId: string) {
    super({
      code: 'CLAIM_NOT_FOUND',
      message: 'Claim not found',
      statusCode: 404,
      details: { claimId },
    });
  }
}

export class ClaimForbiddenError extends DomainError {
  constructor() {
    super({
      code: 'CLAIM_FORBIDDEN',
      message: 'You are not allowed to resolve this claim',
      statusCode: 403,
      details: {},
    });
  }
}

export class ClaimAlreadyResolvedError extends DomainError {
  constructor(status: string) {
    super({
      code: 'CLAIM_ALREADY_RESOLVED',
      message: `Claim is already resolved (${status})`,
      statusCode: 409,
      details: { status },
    });
  }
}