import { DomainError } from "src/core/errors/domain-error";

export class ItemNotFoundError extends DomainError {
  constructor(id: string) {
    super({
      code: 'ITEM_NOT_FOUND',
      message: 'Item not found',
      statusCode: 404,
      fields: { id: [id] },
      details: {},
    });
  }
}

export class OwnerProfileNotFoundError extends DomainError {
  constructor(ownerProfileId: string) {
    super({
      code: 'OWNER_PROFILE_NOT_FOUND',
      message: 'ownerProfileId does not exist',
      statusCode: 400,
      fields: { ownerProfileId: [ownerProfileId] },
      details: {},
    });
  }
}
