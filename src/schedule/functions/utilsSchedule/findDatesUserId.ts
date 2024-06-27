import { Repository } from 'typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';

export async function findDatesUserId(scheduleRepository: Repository<Schedule>, userId: number): Promise<Date[]> {
  const schedules = await scheduleRepository.find({
    where: { userId },
    select: ['fecha'],
  });
  const dates = schedules.map(schedule => schedule.fecha);
  return dates;
}