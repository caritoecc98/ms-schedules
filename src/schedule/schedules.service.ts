import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions,Between,MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
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
      throw new Error('Ya existe un horario de ' + tipo + ' para este usuario a las '+ hora);
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

  async findAllAdmin(): Promise<Schedule[]> {
    return await this.scheduleRepository.find();
  }

  async findAllAdmin2(role:string ,fecha1:string, fecha2:string): Promise<Schedule[]> {
    console.log( fecha1);
    console.log( fecha2);

    const startDate = new Date(fecha1);
    const endDate = new Date(fecha2);

    console.log( startDate);
    console.log( endDate);
    if(role='admin'){
      const schedules = await this.scheduleRepository.find({
        where: [
          { fecha: MoreThanOrEqual(startDate) },
          { fecha: LessThanOrEqual(endDate) },
        ],
      });
      return schedules;
    }
    else{
      throw new Error('El usuario no es admin');
    }
  }

  async findAllUser(userId:number, fecha1:string, fecha2:string): Promise<Schedule[]> {
    console.log( fecha1);
    console.log( fecha2);

    const startDate = new Date(fecha1);
    const endDate = new Date(fecha2);

    console.log( startDate);
    console.log( endDate);
    console.log('userId:', userId);
    const schedulesMayores = await this.scheduleRepository.find({
      where: [
        { created_at: MoreThanOrEqual(startDate),userId:userId },
      ],
    });
    console.log(schedulesMayores);
    const schedulesMenores = await this.scheduleRepository.find({
      where: [
        { created_at: LessThanOrEqual(endDate),userId:userId },
      ],
    });
    console.log(schedulesMenores);
    return schedulesMayores;
  }

  async scheduleRangeAdmin(userId: number, fecha1: string, fecha2: string, role:string) {
    if(role==='admin'){
      return this.scheduleRepository.query(
        `SELECT * FROM schedule WHERE userId = ? AND fecha BETWEEN ? AND ?`,
        [userId, fecha1, fecha2],
      );
    }
    else{
      throw new Error('El usuario no es admin');
    }
  }

  async scheduleRange(userId: number, fecha1: string, fecha2: string) {
    return this.scheduleRepository.query(
      `SELECT * FROM schedule WHERE userId = ? AND fecha BETWEEN ? AND ?`,
      [userId, fecha1, fecha2],
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}