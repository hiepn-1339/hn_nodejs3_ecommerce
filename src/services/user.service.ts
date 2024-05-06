import { MoreThan } from 'typeorm';
import { AppDataSource } from '../database/dataSource';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from '../config';

const userRepository = AppDataSource.getRepository(User);

const generateTokenActive = () => {
  const tokenActive = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(tokenActive).digest('hex');
  return {tokenActive, hashedToken};
};

export const createAccount = async (data: any) => {
  const {tokenActive, hashedToken} = generateTokenActive();

  const user = userRepository.create({
    name: data.name,
    email: data.email,
    password: bcrypt.hashSync(data.password, 10),
    gender: data.gender,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    avatar: data.avatar,
    address: data.address,
    tokenActive: hashedToken,
    tokenActiveExpires: new Date(Date.now() + config.tokenExpirationTime * 60 * 1000),
  });
  
  const newUser = await userRepository.save(user);

  return {
    user: newUser, 
    tokenActive,
  };
};

export const getUserByEmail = async (email: string) => {
  return await userRepository.findOne({
    where: {
      email,
    },
    relations: ['cart'],
  });
};

export const checkValidTokenActive = async (token: string) => {
  const now = new Date();
  return await userRepository.findOne({
    where: {
      tokenActive: token,
      tokenActiveExpires: MoreThan(now),
    },
  });
};

export const activeUser = async (user: User) => {
  user.isActive = true;
  user.tokenActive = null;
  user.tokenActiveExpires = null;

  await userRepository.save(user);
};
