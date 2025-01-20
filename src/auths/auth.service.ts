import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/auth-login.dto';
import { CreateUserDto, UserResponseDto } from 'src/Users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    signInUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; message: string }> {
    const { email, password } = signInUserDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password must be provided');
    }

    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['isAdmin', 'id', 'email', 'password'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, message: 'User logged successfully' };
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { password, confirmPassword, email, ...userData } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      ...userData,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(newUser);

    const userResponse: UserResponseDto = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      country: newUser.country,
      address: newUser.address,
      city: newUser.city,
    };

    return userResponse;
  }
}
