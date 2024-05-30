import { IsNotEmpty, IsDateString, IsString } from 'class-validator';

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
}