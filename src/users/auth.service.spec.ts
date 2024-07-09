import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
    const users: User[] = [];

     // Create a fake copy of the UsersService
      fakeUsersService = {
        find: (email: string) => {
            const filteredUsers = users.filter(user => user.email === email);
            return Promise.resolve(filteredUsers)
        },
        create: (email: string, password: string) => {
            const user = {id: Math.floor(Math.random() * 999), email, password} as User;
            users.push(user);

            return Promise.resolve(user);
        }
    }

    const module = await Test.createTestingModule({
        providers: [AuthService, {
            provide: UsersService,
            useValue: fakeUsersService,
        }]
    }).compile();

    service = module.get(AuthService);
})

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('testing_email@test.com', 'password');

        expect(user.id).toBeDefined();
        expect(user.password).not.toEqual('password');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
        expect(user.email).toEqual('testing_email@test.com')
    })

    it('throws an error if user signs up with an email that is in use', async () => {
        await service.signup('testing_email@test.com', 'doesnthavetomatch')
        
        await expect(service.signup('testing_email@test.com', 'password')).rejects.toThrow(
            BadRequestException,
          );
    })

    it('throws if signin is called with an unused email', async () => {
        fakeUsersService.find = () => Promise.resolve([]);

        await expect(service.signin('asdada@adad.com', 'uefhuoahfouadhf')).rejects.toThrow(NotFoundException);
    }); 

    it('throws if an invalid password is provided', async () => {

        await service.signup('asdf@asdf.com', 'differentPassword');

        await expect(service.signin('asdf@asdf.com', 'password')).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {

        await service.signup('asdf@asdf.com', 'mypassword');

        const user = await service.signin('asdf@asdf.com', 'mypassword')
        expect(user).toBeDefined();
    });

})
