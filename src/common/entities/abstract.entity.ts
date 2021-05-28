import { AbstractDto } from '../dtos';
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UtilityService } from 'utils/services';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountCode: string

  @Column({default: "administrator@gmail.com"})
  createdBy: string

  @Column({nullable: true })
  updatedBy: string

  @Column({nullable: true })
  deletedBy: string

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date;


  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  disabled: boolean;

  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any): T {
    return UtilityService.toDto(this.dtoClass, this, options);
  }
}
