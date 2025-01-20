import { Controller, Post, Body, UsePipes, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth-login.dto';
import { PasswordValidationPipe } from 'src/pipes/password-validate.pipe';
import { CreateUserDto } from 'src/Users/dto/user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Realiza el inicio de sesión de un usuario ya registrado.',
  })
  @ApiBody({
    description: 'Ejemplo de datos para inicio de sesión',
    examples: {
      'application/json': {
        value: {
          email: 'juan.alberto.perez@example.com',
          password: '!Admin123',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta, datos inválidos o faltantes.',
    examples: {
      'Error por campos incompletos': {
        summary: 'Error por datos incompletos',
        value: {
          statusCode: 400,
          message:
            '[Aquí se mostrarán los campos que faltan para poder realizar el registro, como así tambien las constraints de cada campo.]',
          error: 'Bad Request',
        },
      },
      'Error por campos no validos': {
        summary: 'Solicitud incorrecta, datos incorrectos.',
        value: {
          statusCode: 400,
          message: 'Invalid credentials',
          error: 'Bad Request',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZjM4MWVjMC04MzdiLTQyOTctYjdlMC01NDk3YjEzOGYxNTkiLCJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzMyMTE0MzE1LCJleHAiOjE3MzIxMTc5MTV9.LOvRN6tZzvHMRhcbJZslN126a4dlmP3WlA3cTQJDmgc',
      message: 'User logged successfully',
    },
  })
  @HttpCode(200)
  @Post('signin')
  @UsePipes(new PasswordValidationPipe())
  async signIn(@Body() signInUserDto: LoginUserDto) {
    const result = await this.authService.signIn(signInUserDto);
    return result;
  }

  @ApiOperation({
    summary: 'Realiza el registro de un nuevo usuario',
  })
  @ApiBody({
    description: 'Datos para crear un nuevo usuario',
    examples: {
      'application/json': {
        value: {
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          phone: 1234567890,
          country: 'Argentina',
          address: 'Av. Siempre Viva 742',
          city: 'Springfield',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta, datos inválidos o faltantes.',
    example: {
      statusCode: 400,
      message:
        '[Aquí se mostrarán los campos que faltan para poder realizar el registro, como así tambien las constraints de cada campo.]',
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 20,
    example: {
      message: 'User Registered successfully',
      result: {
        name: 'Juan Gema',
        email: 'juan@example.com',
        phone: 1234567890,
        country: 'Argentina',
        address: 'Av. Siempre Viva 742',
        city: 'Springfield',
      },
    },
  })
  @Post('signup')
  @UsePipes(new PasswordValidationPipe())
  async signUp(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.signUp(createUserDto);
    return { message: 'User Registered successfully', result };
  }
}
