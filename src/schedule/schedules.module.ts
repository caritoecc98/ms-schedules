import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ScheduleController } from './schedules.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants/jwt.constant';

@Module({
    imports: [
      TypeOrmModule.forFeature([Schedule]),
      JwtModule.register({
        secret: jwtConstants.secret, 
      }),
    ],
    controllers: [ScheduleController],
    providers: [SchedulesService],
    exports: [SchedulesService],
  })
export class SchedulesModule {}
