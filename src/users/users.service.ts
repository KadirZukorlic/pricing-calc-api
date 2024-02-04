import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepository.create({
      email,
      password,
    });
    return this.userRepository.save(user);
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found.');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    // return this.userRepository.delete({ id }); //  hooks doesn't run
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found.');
    }
    return this.userRepository.remove(user); // hooks run with this approach
  }
}
