import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserAuthForgottenPasswordEntity } from '../entities';
import { UtilityService } from 'utils/services';

@EventSubscriber()
export class UserAuthForgottenPasswordSubscriber
  implements EntitySubscriberInterface<UserAuthForgottenPasswordEntity> {
  listenTo() {
    return UserAuthForgottenPasswordEntity;
  }

  async beforeInsert({
    entity,
  }: InsertEvent<UserAuthForgottenPasswordEntity>): Promise<void> {
    if (entity.hashedToken) {
      /**
       * the token is longer than 72 characters, so it needs to be encoded first with sha256
       */
      const hashedToken = UtilityService.encodeString(entity.hashedToken);

      entity.hashedToken = await UtilityService.generateHash(hashedToken);
    }
  }

  async beforeUpdate({
    entity,
  }: UpdateEvent<UserAuthForgottenPasswordEntity>): Promise<void> {
    if (entity.hashedToken) {
      /**
       * the hashedToken is longer than 72 characters, so it needs to be encoded first with sha256
       */
      const hashedToken = UtilityService.encodeString(entity.hashedToken);

      entity.hashedToken = await UtilityService.generateHash(hashedToken);
    }
  }
}
