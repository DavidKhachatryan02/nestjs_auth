import { compare, hash, genSalt } from 'bcrypt';
import { Salt } from './constants';

export const hashPassword = async (password: string): Promise<string> =>
  await hash(password, await genSalt(Salt));

export const isCorrectPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => await compare(password, hashedPassword);
