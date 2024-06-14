import { IsNotEmpty, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  tipo:string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @IsNotEmpty()
  @IsString()
  hora: string;

  @IsOptional()
  latitude: string;

  @IsOptional()
  longitude: string;

  @IsNotEmpty()
  edit: string;
}