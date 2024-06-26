import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID of user.' })
  id: number;

  @ApiProperty({
    example: 'UserName',
    description: 'username of user.',
  })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'email of user.',
  })
  email: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The creation date of the user.',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'update date of the user.',
  })
  updatedAt: Date;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4',
    description: 'user JWT auth token.',
  })
  token: string;
}
