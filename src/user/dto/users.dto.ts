import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  last_name: string;
  @ApiProperty()
  hobbies: string[];
  @ApiPropertyOptional()
  city_id: number;

  constructor({ name, last_name, hobbies, city_id }: UserDto) {
    this.name = name;
    this.last_name = last_name;
    this.hobbies = hobbies;
    this.city_id = city_id;
  }
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  last_name: string;
  hobbies: string[];
  city_id: number;
}
