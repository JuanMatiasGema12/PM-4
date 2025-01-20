import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value.password && typeof value.password !== 'string') {
      throw new BadRequestException('Password must be a string');
    }

    if (value.confirmPassword && typeof value.confirmPassword !== 'string') {
      throw new BadRequestException('Confirm Password must be a string');
    }

    if (
      value.password &&
      value.confirmPassword &&
      value.password !== value.confirmPassword
    ) {
      throw new BadRequestException('Password and confirmPassword must match');
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

    if (value.password && !passwordRegex.test(value.password)) {
      throw new BadRequestException(
        'Password must be between 8 and 15 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
      );
    }
    return value;
  }
}
