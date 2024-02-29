import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/users.dto';
import { PrismaService } from '../prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
describe('CatsController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockCreateUserDto: CreateUserDto = {
    name: 'test',
    last_name: 's',
    hobbies: [],
    city_id: 1,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();
    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });
  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result: Promise<CreateUserDto[]> = Promise.resolve([
        { name: 'test', last_name: 's', hobbies: [], city_id: 1 },
      ]);
      jest.spyOn(userService, 'getUsers').mockImplementation(() => result);
      expect(await userController.getUsers()).toEqual([
        { name: 'test', last_name: 's', hobbies: [], city_id: 1 },
      ]);
    });
  });

  describe('createUser', () => {
    it('should return the created user', async () => {
      jest
        .spyOn(userService, 'createUser')
        .mockResolvedValueOnce({ ...mockCreateUserDto, id: 1 });

      const result = await userController.createUser(mockCreateUserDto);

      expect(result).toEqual({ ...mockCreateUserDto, id: 1 });
    });

    it('should throw an error if an exception occurs during user creation', async () => {
      const error = new Error('Failed to create user');
      jest.spyOn(userService, 'createUser').mockRejectedValueOnce(error);

      await expect(
        userController.createUser(mockCreateUserDto),
      ).rejects.toThrowError(error);
    });
  });
});
