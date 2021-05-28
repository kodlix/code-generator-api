import { AbstractEntity } from 'common/entities';
import { Column, Entity } from 'typeorm';
import { ClientContactPersonDto } from '../dtos';

@Entity({ name: 'ClientContactPerson' })
export class ClientContactPersonEntity extends AbstractEntity<ClientContactPersonDto> {
  @Column()
  clientId:	string;
  
  @Column()
  clientCode:	string;

  @Column()
  contactPersion: string

  @Column()
  designation:	string;
  
  @Column()
  email:	string;	

  @Column({nullable: true})
  website?: string;

  @Column()
  phoneNumber:	string;	

  @Column({nullable: true})
  alternatePhoneNumber?:	string;	

  @Column({nullable: true})
  faxNumber?:	string;	

  dtoClass = ClientContactPersonDto;
}
