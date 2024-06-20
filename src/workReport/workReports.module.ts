import { Module } from '@nestjs/common';
import { WorkReportService } from './workReports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkReport } from './entity/workReport.entity';
import { WorkReportController } from './workReports.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants/jwt.constant';

@Module({
    imports: [
      TypeOrmModule.forFeature([WorkReport]),
      JwtModule.register({
        secret: jwtConstants.secret, 
      }),
    ],
    controllers: [WorkReportController],
    providers: [WorkReportService],
    exports: [WorkReportService],
  })
  
export class WorkReportModule {}
