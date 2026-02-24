export type UserRegisteredPayload = {
  profileId: string;
  email: string;
  username: string;
};

export class UserRegisteredEvent {
  static readonly EVENT_NAME = 'auth.user.registered';
}