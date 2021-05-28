import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from 'modules/user/entities';
import { UtilityService } from 'utils/services';
import { RoleType } from 'common/constants';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    event.entity.firstName = UtilityService.capitalizeName(event.entity.firstName);
    event.entity.lastName = UtilityService.capitalizeName(event.entity.lastName);

    if(event.entity.role === RoleType.SUPER_ADMIN){
      event.entity.accountCode = UtilityService.generateUniqueAccountCode(event.entity.businessName)
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    if (event.entity?.lastName !== event.databaseEntity?.lastName) {
      event.entity.lastName = UtilityService.capitalizeName(event.entity.lastName);
    }
  }
}
