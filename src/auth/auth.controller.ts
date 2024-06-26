import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'Data for Registration',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  signUp(@Body() registerBody: RegisterDto) {
    return this.authService.register(registerBody);
  }

  @Post('signIn')
  @ApiOperation({
    summary: 'login User',
  })
  @ApiBody({
    description: 'Data for login',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Incorrect credentials.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  signIn(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by JWT token' })
  @ApiBearerAuth('jwt-auth')
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@Request() req) {
    console.log(req.user);
    return this.authService.getMe(req.user);
  }
}
