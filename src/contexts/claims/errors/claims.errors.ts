import { DomainError } from 'src/core/errors/domain-error';

export class ItemNotFoundForClaimError extends DomainError {
  constructor(itemId: string) {
    super({
      code: 'ITEM_NOT_FOUND',
      message: 'Item not found',
      statusCode: 404,
      details: { itemId },
    });
  }
}

export class CannotClaimOwnItemError extends DomainError {
  constructor() {
    super({
      code: 'CANNOT_CLAIM_OWN_ITEM',
      message: 'You cannot create a claim on your own item',
      statusCode: 400,
      details: {},
    });
  }
}

export class DuplicateClaimError extends DomainError {
  constructor(params: { itemId: string; requesterProfileId: string }) {
    super({
      code: 'CLAIM_ALREADY_EXISTS',
      message: 'A pending claim already exists for this item and requester',
      statusCode: 409,
      details: params,
    });
  }
}

export class ClaimNotFoundError extends DomainError {
  constructor(params: { itemId: string; claimId: string }) {
    super({
      code: 'CLAIM_NOT_FOUND',
      message: 'Claim not found',
      statusCode: 404,
      details: params,
    });
  }
}

export class ClaimNotPendingError extends DomainError {
  constructor(currentStatus: string) {
    super({
      code: 'CLAIM_NOT_PENDING',
      message: 'Only pending claims can be resolved',
      statusCode: 409,
      details: { currentStatus },
    });
  }
}

export class ClaimResolveForbiddenError extends DomainError {
  constructor() {
    super({
      code: 'CLAIM_RESOLVE_FORBIDDEN',
      message: 'Only the item owner can accept/reject this claim',
      statusCode: 403,
      details: {},
    });
  }
}

export class ClaimAlreadyResolvedError extends DomainError {
  constructor() {
    super({
      code: 'CLAIM_ALREADY_RESOLVED',
      message: 'Claim already resolved',
      statusCode: 409,
      details: {},
    });
  }
}