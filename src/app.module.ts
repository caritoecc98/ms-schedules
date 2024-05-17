import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesModule } from './schedule/schedules.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'user_crud',
      password: 'root',
      database: 'db_schedule',
      autoLoadEntities: true,
      synchronize: true,
    }),
  SchedulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

