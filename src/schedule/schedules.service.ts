import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}
  
  //async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
  //  const schedule = this.scheduleRepository.create(createScheduleDto);
  //  return this.scheduleRepository.save(schedule);
  //}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const { userId, tipo,fecha,hora } = createScheduleDto;
    console.log(userId , fecha,  tipo);
    const schedule = await this.scheduleRepository.findOne({ where: { userId, fecha, tipo } });
    console.log(schedule)
    if (schedule) {
      throw new Error('Ya existe un horario para este usuario.');
    }
    const newSchedule = this.scheduleRepository.create(createScheduleDto);
    return this.scheduleRepository.save(newSchedule);
  }

  async findAllByUserId(userId: number): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      where: {userId: userId},
    });
  }


  findAll() {
    return this.scheduleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}