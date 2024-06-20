import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';

export async function getAllUsers(scheduleRepository: Repository<Schedule>): Promise<number[]> {
    const query = `
    SELECT DISTINCT userId
    FROM schedule
  `;
  const schedules = await scheduleRepository.query(query);
  return schedules.map((schedule: any) => schedule.userId);
}