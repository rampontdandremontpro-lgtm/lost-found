import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERM_KEY } from './require-perm.decorator';
import { PermissionService } from './permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissions: PermissionService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<bigint>(REQUIRE_PERM_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!required) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { permissionMask?: string };

    const mask = user?.permissionMask ?? '0';
    return this.permissions.has(mask, required);
  }
}