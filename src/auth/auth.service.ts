import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entities/user.entity';
import { hashPassword, isCorrectPassword } from '../utils/helpers';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    try {
      const isUserExists = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (isUserExists) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await hashPassword(registerDto.password);

      const newUser = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
      });

      await this.userRepository.save(newUser);
      const token = this.jwtService.sign({ id: newUser.id });

      return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        token,
      };
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      console.error('Error creating user:', err);
      throw new InternalServerErrorException(
        `Error creating ${err} user ${err.message}`,
      );
    }
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<UserResponseDto | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) throw new NotFoundException('User not found');

      const isMatch = await isCorrectPassword(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Incorrect password');
      }
      const token = this.jwtService.sign({ id: user.id });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
      };
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof UnauthorizedException
      ) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Error finding ${err} user ${err.message}`,
      );
    }
  }

  async getMe({ id }): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const token = this.jwtService.sign({ id: user.id });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException(
        `Error getting ${err} user ${err.message}`,
      );
    }
  }
}
