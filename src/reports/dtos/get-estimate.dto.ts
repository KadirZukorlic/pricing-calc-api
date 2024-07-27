import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1930)
  @Max(2050)
  year: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  lat: number;
}
