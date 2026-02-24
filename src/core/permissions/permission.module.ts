import { Global, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionGuard } from './permission.guard';

@Global()
@Module({
  providers: [PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionModule {}