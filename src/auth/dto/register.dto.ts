import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'UserName',
    description: 'username of user.',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description:
      'email address of user. Must be a valid email and is required.',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      'password for the user account. Between 6 and 20 characters and is required.',
    required: true,
  })
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
