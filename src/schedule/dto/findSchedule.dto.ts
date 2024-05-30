import { IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class findScheduleDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  tipo:string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

}