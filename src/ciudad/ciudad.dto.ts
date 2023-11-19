import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { Cities } from '../shared/cities/cities-list';

export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsEnum(Cities)
  readonly pais: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly numeroHabitantes: number;
}
