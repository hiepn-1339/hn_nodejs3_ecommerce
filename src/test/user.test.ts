import { faker } from '@faker-js/faker';
import { AppDataSource } from '../database/dataSource';
import { User } from '../entities/user.entity';
import { Cart } from '../entities/cart.entity';
import { Gender, Role } from '../constants';
import * as userService from '../services/user.service';
import * as cartService from '../services/cart.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

let connection;
let userRepository;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
});

afterAll(async () => {
  await connection.destroy();
});

describe('registerUser', () => {
  let name: string;
  let email: string;
  let password: string;
  let phone: string;
  let address: string;
  let gender: string;
  let dateOfBirth: Date;
  let avatar: string;
  let result: { user: User; tokenActive: string };
  let cart: Cart;

  beforeEach(async () => {
    name = faker.internet.userName();
    email = faker.internet.email();
    password = faker.internet.password();
    phone = faker.phone.number();
    address = faker.location.secondaryAddress();
    gender = faker.helpers.enumValue(Gender);
    dateOfBirth = faker.date.past();
    avatar = faker.internet.url();
    result = await userService.createAccount({
      name,
      email,
      password,
      phone,
      address,
      gender,
      dateOfBirth,
      avatar,
    });
    cart = await cartService.createCart(result.user);
  });

  it('should register a new user', () => {
    expect(result.user).toBeInstanceOf(User);
  });

  it('should create a cart for the new user', () => {
    expect(cart).toBeInstanceOf(Cart);
  });
});

describe('checkValidTokenActive function', () => {
  let user: User;
  let tokenActive: string;
  
  beforeEach(async () => {
    user = await userRepository.findOne({
      where: {
        isActive: false,
      },
    });

    tokenActive = crypto.randomBytes(32).toString('hex');

    user.tokenActive = crypto
      .createHash('sha256')
      .update(tokenActive)
      .digest('hex');

    user.tokenActiveExpires = new Date(Date.now() + 10 * 60 * 1000);

    user = await userRepository.save(user);
  });

  it('should return user when token is valid and not expired', async () => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(tokenActive)
      .digest('hex');
    const userValid = await userService.checkValidTokenActive(hashedToken);
    expect(userValid.email).toEqual(user.email);
  });

  it('should return null when token is invalid or expired', async () => {
    const token = 'invalidToken';
    const userInValid = await userService.checkValidTokenActive(token);
    expect(userInValid).toBeNull();
  });
});

describe('activeUser function', () => {
  let user: User;
  
  beforeEach(async () => {
    user = await userRepository.findOne({
      where: {
        isActive: false,
      },
    });
  });

  it('should set user as active and clear token details', async () => {
    await userService.activeUser(user);
    expect(user.isActive).toBe(true);
    expect(user.tokenActive).toBeNull();
    expect(user.tokenActiveExpires).toBeNull();
  });
});

describe('getUserByEmail', () => {
  it('should return user when email is found', async () => {
    const email = 'Annabel.Lind@yahoo.com';
    const user = await userService.getUserByEmail(email);
    
    expect(user.email).toEqual(email);
  });

  it('should return null when email is not found', async () => {
    const email = 'nonexistent@example.com';
    const user = await userService.getUserByEmail(email);
    
    expect(user).toBeNull();
  });
});

describe('getUsers', () => {
  it('should return all users', async () => {
    const data = {
      keyword: 'Hai',
      gender: 'MALE',
      status: 'ACTIVE',
      page: 1,
      limit: 10,
    };

    const words = data.keyword.toLocaleLowerCase().split(' ');

    const {users, count} = await userService.getUsers(data);
    
    expect(users).toBeInstanceOf(Array);
    expect(count).toBeGreaterThanOrEqual(0);
    users.forEach(user => {
      expect(user).toBeInstanceOf(User);
      expect(user.gender).toEqual(data.gender);
      expect(user.isActive).toEqual(true);
      const nameContainsKeyword = words.some(word => user.name.toLocaleLowerCase().includes(word));
      const addressContainsKeyword = words.some(word => user.address.toLocaleLowerCase().includes(word));
      expect(nameContainsKeyword || addressContainsKeyword).toBe(true);
    });
  });
});

describe('adminCreateAccount', () => {
  it('should create a new user', async () => {
    const data = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      address: faker.location.secondaryAddress(),
      gender: faker.helpers.enumValue(Gender),
      dateOfBirth: faker.date.past(),
      avatar: faker.internet.url(),
      isActive: faker.datatype.boolean(),
      role: faker.helpers.enumValue(Role),
    };

    const user = await userService.adminCreateAccount(data);

    const checkPassword = await bcrypt.compare(data.password, user.password);

    expect(user).toBeInstanceOf(User);
    expect(user.role).toEqual(data.role); 
    expect(user.email).toEqual(data.email);
    expect(checkPassword).toEqual(true);
    expect(user.phone).toEqual(data.phone);
    expect(user.address).toEqual(data.address);
    expect(user.gender).toEqual(data.gender);
    expect(user.dateOfBirth).toEqual(data.dateOfBirth);
    expect(user.avatar).toEqual(data.avatar);
    expect(user.role).toEqual(data.role);
    expect(user.isActive).toEqual(data.isActive);
  });
}); 

describe('getUserById', () => {
  it('should return a user', async () => {
    const id = faker.number.int({min: 1, max: 1000});

    const user = await userService.getUserById(id);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toEqual(id); 
  });
}); 

describe('adminUpdateUser', () => {
  it('should update user with provided data', async () => {
    const data = {
      isActive: faker.datatype.boolean(),
      role: faker.helpers.enumValue(Role),
    };

    const id = faker.number.int({min: 1, max: 1000});

    const user = await userService.getUserById(id);

    const newUser = await userService.adminUpdateUser(user, data);

    expect(newUser).toBeInstanceOf(User);
    expect(newUser.role).toEqual(data.role);
    expect(newUser.isActive).toEqual(data.isActive);
  });
}); 
