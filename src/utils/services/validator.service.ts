import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { RoleType } from 'common/constants';

@Injectable()
export class ValidatorService {
  public isImage(mimeType: string): boolean {
    const imageMimeTypes = ['image/jpeg', 'image/png'];

    return _.includes(imageMimeTypes, mimeType);
  }

  public isHigherRole(role: RoleType): boolean {
    if (
      Object.values(RoleType)
        .filter((item) => item !== RoleType.USER)
        .includes(role)
    ) {
      return true;
    }

    return false;
  }
}
