import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number): Promise<User> => {
        return Promise.resolve({
          id,
          email: 'myemail@email.com',
          password: 'password',
        } as User);
      },
      find: (email: string): Promise<User[]> => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
      // remove: (id: number): Promise<User> => {
      //   return Promise.resolve({
      //     id,
      //     email: 'myemail@email.com',
      //     password: 'password',
      //   } as User);
      // },
      // update: (id: number, attrs: Partial<User>): Promise<User> => {
      //   return Promise.resolve({
      //     id,
      //     email: 'myemail@email.com',
      //     password: 'password',
      //   } as User);
      // },
    };
    fakeAuthService = {
      signin: (email: string, password: string): Promise<User> => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signup: (email: string, password: string): Promise<User> => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = (await controller.findAllUsers('asdf@asdf.com')) as User[];

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow();
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
