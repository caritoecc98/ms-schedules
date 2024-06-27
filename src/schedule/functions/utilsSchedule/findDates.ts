import { Repository } from 'typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';

export async function findDates(scheduleRepository: Repository<Schedule>): Promise<Date[]> {
  const schedules = await scheduleRepository.find({
    select: ['fecha'],
  });
  const dates = schedules.map(schedule => schedule.fecha);
  return dates;
}