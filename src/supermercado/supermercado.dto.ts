import {
  IsString,
  IsNotEmpty,
  IsLongitude,
  IsLatitude,
  IsUrl,
  MinLength,
} from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @MinLength(11)
  @IsNotEmpty()
  readonly nombre: string;

  @IsLongitude()
  @IsNotEmpty()
  readonly longitud: number;

  @IsLatitude()
  @IsNotEmpty()
  readonly latitud: number;

  @IsUrl()
  @IsNotEmpty()
  readonly paginaWeb: string;
}
