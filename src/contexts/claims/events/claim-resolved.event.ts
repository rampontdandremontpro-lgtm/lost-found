export type ClaimResolution = 'ACCEPTED' | 'REJECTED';

export type ClaimResolvedPayload = {
  claimId: string;
  itemId: string;
  itemTitle: string;
  itemStatus: 'LOST' | 'FOUND';

  requesterProfileId: string;
  requesterUsername: string;
  requesterEmail: string;

  ownerProfileId: string;
  ownerUsername: string;
  ownerMessage?: string;
  resolution: ClaimResolution;
};

export class ClaimResolvedEvent {
  static readonly EVENT_NAME = 'claim.resolved';

  constructor(public readonly payload: ClaimResolvedPayload) {}

  get name() {
    return ClaimResolvedEvent.EVENT_NAME;
  }
}