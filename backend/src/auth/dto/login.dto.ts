import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'admin123',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
