import { IsNotEmpty, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateWorkReportDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsDateString()
  dateReport: Date;

  @IsNotEmpty()
  hours: number;
  
  @IsNotEmpty()
  minutes: number;
}