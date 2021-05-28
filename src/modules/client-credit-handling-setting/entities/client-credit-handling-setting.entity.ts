import { AbstractEntity } from 'common/entities';
import { Column, Entity } from 'typeorm';
import { ClientCreditHandlingSettingDto } from '../dtos';

@Entity({ name: 'ClientCreditHandlingSetting' })
export class ClientCreditHandlingSettingEntity extends AbstractEntity<ClientCreditHandlingSettingDto> {

  @Column({ unique: true })
  clientId:	string;

  @Column({ unique: true })
  clientCode:	string;

  @Column({ unique: true })
  clientName:	string;

  @Column({default:false})
  allowCredit:	boolean;

  @Column()
  maximumCreditDays:	number;

  @Column()
  creditLimit: number;

  @Column({default:false})
  allowMultipleCredit:	boolean;

  @Column({default:false})
  enforceCreditDays:	boolean;

  @Column()
  escalationValue:	number;

  @Column({nullable: true})
  escalationDays?:	number;

  dtoClass = ClientCreditHandlingSettingDto;
}
