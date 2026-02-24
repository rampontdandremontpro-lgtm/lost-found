export const addPerm = (mask: bigint, perm: bigint) => mask | perm;

export const removePerm = (mask: bigint, perm: bigint) => mask & ~perm;

export const hasPerm = (mask: bigint, perm: bigint) => (mask & perm) !== 0n;

export const hasAnyPerm = (mask: bigint, perm: bigint) => (mask & perm) !== 0n;

export const hasAllPerms = (mask: bigint, perm: bigint) => (mask & perm) === perm;
