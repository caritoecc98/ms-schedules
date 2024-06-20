import { IsNotEmpty, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDto {

    @IsOptional()
    @IsNotEmpty()
    tipo:string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    fecha: Date;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    hora: string;
  
    @IsOptional()
    latitude: string;

    @IsOptional()
    longitude: string;
}