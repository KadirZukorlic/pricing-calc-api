import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('User has been inserted', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User has been updated', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User has been removed', this.id);
  }
}
