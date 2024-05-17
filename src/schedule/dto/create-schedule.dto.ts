import { IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @IsNotEmpty()
  @IsString()
  hora: string;
}