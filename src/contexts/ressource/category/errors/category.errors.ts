import { DomainError } from "src/core/errors/domain-error";

export class CategoryNotFoundError extends DomainError {
  constructor(idOrName: string) {
    super({
      code: 'CATEGORY_NOT_FOUND',
      message: 'Category not found',
      statusCode: 404,
      fields: { category: [idOrName] },
      details: {},
    });
  }
}

export class CategoryAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super({
      code: 'CATEGORY_ALREADY_EXISTS',
      message: 'Category already exists',
      statusCode: 409,
      fields: { name: [name] },
      details: {},
    });
  }
}
