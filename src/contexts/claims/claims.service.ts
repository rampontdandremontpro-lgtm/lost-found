import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ClaimEntity } from './entities/claim.entity';
import { ItemEntity } from '../items/entities/item.entity';
import { UserProfileEntity } from '../profile/entities/user_profile.entity';

import { ItemClaimedEvent, type ItemClaimedPayload } from './events/item-claimed.event';
import { ClaimResolvedEvent, type ClaimResolvedPayload } from './events/claim-resolved.event';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimRepo: Repository<ClaimEntity>,

    @InjectRepository(ItemEntity)
    private readonly itemRepo: Repository<ItemEntity>,

    @InjectRepository(UserProfileEntity)
    private readonly profileRepo: Repository<UserProfileEntity>,

    private readonly emitter: EventEmitter2, 
  ) {}

  async create(itemId: string, params: { requesterProfileId: string; message: string }) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new Error('Item not found');

    if (params.requesterProfileId === item.ownerProfileId) {
      throw new Error('Cannot claim your own item');
    }

    const existing = await this.claimRepo.findOne({
      where: {
        itemId,
        requesterProfileId: params.requesterProfileId,
        status: 'PENDING',
      },
    });
    if (existing) throw new Error('Claim already exists');

    const requester = await this.profileRepo.findOne({
      where: { id: params.requesterProfileId },
      relations: { credentials: true },
    });
    if (!requester) throw new Error('Requester not found');

    const owner = await this.profileRepo.findOne({
      where: { id: item.ownerProfileId },
      relations: { credentials: true },
    });
    if (!owner) throw new Error('Owner not found');

    const claim = this.claimRepo.create({
      itemId,
      requesterProfileId: params.requesterProfileId,
      targetProfileId: item.ownerProfileId,
      message: params.message,
      status: 'PENDING',
      resolvedMessage: null,
      resolvedAt: null,
    });

    const saved = await this.claimRepo.save(claim);

    const payload: ItemClaimedPayload = {
      claimId: saved.id,
      itemId: item.id,
      itemTitle: item.title,
      itemStatus: item.status,
      targetEmail: owner.credentials.email,
      requesterUsername: requester.username,
      message: params.message,
    };

    this.emitter.emit(ItemClaimedEvent.EVENT_NAME, payload);

    return saved;
  }

  async findByItem(itemId: string) {
    return this.claimRepo.find({
      where: { itemId },
      order: { createdAt: 'DESC' },
    });
  }

  async accept(ownerProfileId: string, itemId: string, claimId: string, message?: string) {
    const claim = await this.claimRepo.findOne({ where: { id: claimId, itemId } });
    if (!claim) throw new Error('Claim not found');

    if (claim.targetProfileId !== ownerProfileId) throw new Error('Forbidden');

    if (claim.status !== 'PENDING') throw new Error('Claim already resolved');

    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new Error('Item not found');

    const owner = await this.profileRepo.findOne({
      where: { id: ownerProfileId },
      relations: { credentials: true },
    });
    if (!owner) throw new Error('Owner not found');

    const requester = await this.profileRepo.findOne({
      where: { id: claim.requesterProfileId },
      relations: { credentials: true },
    });
    if (!requester) throw new Error('Requester not found');

    claim.status = 'ACCEPTED';
    claim.resolvedMessage = message ?? null;
    claim.resolvedAt = new Date();

    const saved = await this.claimRepo.save(claim);

    const payload: ClaimResolvedPayload = {
      claimId: saved.id,
      itemId: item.id,
      itemTitle: item.title,
      itemStatus: item.status,

      requesterProfileId: requester.id,
      requesterUsername: requester.username,
      requesterEmail: requester.credentials.email,

      ownerProfileId: owner.id,
      ownerUsername: owner.username,
      ownerMessage: message,
      resolution: 'ACCEPTED',
    };

    this.emitter.emit(ClaimResolvedEvent.EVENT_NAME, payload);

    return saved;
  }

  async reject(ownerProfileId: string, itemId: string, claimId: string, message?: string) {
    const claim = await this.claimRepo.findOne({ where: { id: claimId, itemId } });
    if (!claim) throw new Error('Claim not found');

    if (claim.targetProfileId !== ownerProfileId) throw new Error('Forbidden');

    if (claim.status !== 'PENDING') throw new Error('Claim already resolved');

    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new Error('Item not found');

    const owner = await this.profileRepo.findOne({
      where: { id: ownerProfileId },
      relations: { credentials: true },
    });
    if (!owner) throw new Error('Owner not found');

    const requester = await this.profileRepo.findOne({
      where: { id: claim.requesterProfileId },
      relations: { credentials: true },
    });
    if (!requester) throw new Error('Requester not found');

    claim.status = 'REJECTED';
    claim.resolvedMessage = message ?? null;
    claim.resolvedAt = new Date();

    const saved = await this.claimRepo.save(claim);

    const payload: ClaimResolvedPayload = {
      claimId: saved.id,
      itemId: item.id,
      itemTitle: item.title,
      itemStatus: item.status,

      requesterProfileId: requester.id,
      requesterUsername: requester.username,
      requesterEmail: requester.credentials.email,

      ownerProfileId: owner.id,
      ownerUsername: owner.username,
      ownerMessage: message,
      resolution: 'REJECTED',
    };

    this.emitter.emit(ClaimResolvedEvent.EVENT_NAME, payload);

    return saved;
  }
}