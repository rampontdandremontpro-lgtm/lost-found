export type ItemClaimedPayload = {
  claimId: string;
  itemId: string;
  itemTitle: string;
  itemStatus: 'LOST' | 'FOUND';
  targetEmail: string;
  requesterUsername: string;
  message: string;
};

export class ItemClaimedEvent {
  static readonly EVENT_NAME = 'claim.created';

  constructor(public readonly payload: ItemClaimedPayload) {}

  get name() {
    return ItemClaimedEvent.EVENT_NAME;
  }
}