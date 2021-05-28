import { AbstractEntity } from 'common/entities';
import { Column, Entity } from 'typeorm';
import { ClientDto } from '../dtos';

@Entity({ name: 'Client' })
export class ClientEntity extends AbstractEntity<ClientDto> {
  @Column({ unique: true })
  clientCode:	string;

  @Column({ length: 10 })
  clientShortCode: string

  @Column({ length: 512 })
  clientName:	string;
  
  @Column()
  address:	string;	

  @Column({nullable: true})
  url:	string;	

  @Column()
  contactPerson:	string;	

  @Column()
  accountNo:	number;	

  @Column()
  commencementDate:	Date;
  
  @Column({default:false})
  suspendOperation:	boolean;

  @Column({default: false})
  supportAutoBusinessDay:	boolean;

  @Column({nullable: true})
  clientLogoUrl: string;

  @Column({nullable: true})
  uploadProperties: 	string

  @Column({nullable: true})
  clientCodeOriginal:	string;	

  @Column({nullable: true})
  clientShortCodeOriginal:	string;	

  dtoClass = ClientDto;
}
