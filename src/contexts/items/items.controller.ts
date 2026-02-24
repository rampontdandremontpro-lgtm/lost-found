import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsQueryDto } from './dto/items-query.dto';

import { RequirePerm } from 'src/core/permissions/require-perm.decorator';
import { PermissionGuard } from 'src/core/permissions/permission.guard';
import { PERM } from 'src/core/permissions/permission';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/jwt/current-user.decorator';
import type { JwtPayload } from '../auth/jwt/jwt.payload';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePerm(PERM.ITEM_CREATE)
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateItemDto) {
    return this.itemsService.create(user.profileId, dto);
  }

  @Get()
  findAll(@Query() query: ItemsQueryDto) {
    return this.itemsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePerm(PERM.ITEM_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePerm(PERM.ITEM_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}