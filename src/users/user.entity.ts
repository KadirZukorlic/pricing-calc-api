import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/reports.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, () => (report) => report.user)
  reports: Report[];

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
