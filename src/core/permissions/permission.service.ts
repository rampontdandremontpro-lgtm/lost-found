import { Injectable } from '@nestjs/common';
import { ROLE_PERMS } from './permission';
import { addPerm, removePerm, hasAllPerms, hasAnyPerm, hasPerm } from './permission.utils';

@Injectable()
export class PermissionService {
  toMask(value: string | number | bigint | null | undefined): bigint {
    if (value === null || value === undefined) return 0n;
    if (typeof value === 'bigint') return value;
    return BigInt(value);
  }

  toDb(mask: bigint): string {
    return mask.toString();
  }

  has(maskValue: string | bigint, perm: bigint): boolean {
    const mask = this.toMask(maskValue);
    return hasPerm(mask, perm);
  }

  hasAll(maskValue: string | bigint, perms: bigint): boolean {
    const mask = this.toMask(maskValue);
    return hasAllPerms(mask, perms);
  }

  add(maskValue: string | bigint, perm: bigint): bigint {
    const mask = this.toMask(maskValue);
    return addPerm(mask, perm);
  }

  remove(maskValue: string | bigint, perm: bigint): bigint {
    const mask = this.toMask(maskValue);
    return removePerm(mask, perm);
  }

  userDefault(): bigint {
    return ROLE_PERMS.USER;
  }

  adminDefault(): bigint {
    return ROLE_PERMS.ADMIN;
  }
}
