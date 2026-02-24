import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERM_KEY = 'require_perm';

export const RequirePerm = (perm: bigint) => SetMetadata(REQUIRE_PERM_KEY, perm);