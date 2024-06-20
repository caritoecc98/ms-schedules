import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ScheduleController } from './schedules.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants/jwt.constant';
import { WorkReportModule } from 'src/workReport/workReports.module';
import { DailyReportForAll } from 'src/workReport/entity/dailyReport.entity';
import { WorkReport } from 'src/workReport/entity/workReport.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Schedule,DailyReportForAll,WorkReport]),
      JwtModule.register({
        secret: jwtConstants.secret, 
      }),
      WorkReportModule,      
    ],
    controllers: [ScheduleController],
    providers: [SchedulesService],
    exports: [SchedulesService],
  })
export class SchedulesModule {}
