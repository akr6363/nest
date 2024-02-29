import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/users.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      // Mock the PrismaService's findMany method
      const users = [
        { id: 1, name: 'John Doe', last_name: 'Doe', hobbies: [], city_id: 1 },
        {
          id: 2,
          name: 'Jane Smith',
          last_name: 'Smith',
          hobbies: [],
          city_id: 2,
        },
      ];
      jest.spyOn(prismaService.users, 'findMany').mockResolvedValueOnce(users);

      // Call the getUsers method
      const result = await userService.getUsers();

      // Assert that the result is the same as the mocked users
      expect(result).toEqual(users);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      // Mock the PrismaService's create method
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        last_name: 'Doe',
        hobbies: [],
        city_id: 1,
      };
      const createdUser = {
        id: 1,
        name: 'John Doe',
        last_name: 'Doe',
        hobbies: [],
        city_id: 1,
      };
      jest
        .spyOn(prismaService.users, 'create')
        .mockResolvedValueOnce(createdUser);

      // Call the createUser method
      const result = await userService.createUser(createUserDto);

      // Assert that the result is the same as the mocked created user
      expect(result).toEqual(createdUser);
    });

    it('should throw an HttpException if an error occurs during user creation', async () => {
      // Mock the PrismaService's create method to throw an error
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        last_name: 'Doe',
        hobbies: [],
        city_id: 1,
      };
      const error = new Error('Failed to create user');
      jest.spyOn(prismaService.users, 'create').mockRejectedValueOnce(error);

      // Call the createUser method and expect it to throw an HttpException
      await expect(userService.createUser(createUserDto)).rejects.toThrowError(
        new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
