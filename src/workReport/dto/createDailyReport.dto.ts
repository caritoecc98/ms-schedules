import { IsNotEmpty, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateDailyReportDto {
  
  @IsNotEmpty()
  @IsDateString()
  dateReport: Date;

  @IsNotEmpty()
  hours: number;
  
  @IsNotEmpty()
  minutes: number;
}