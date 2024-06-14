import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions,Between,MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateScheduleDto } from './dto/createSchedule.dto';
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
      console.log(('Ya existe un horario de ' + tipo + ' para este usuario a las '+ hora))
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

  async scheduleRangeAdmin( fecha1: string, fecha2: string) {
    const userId=2
    console.log(userId)
    console.log(fecha1)
    console.log(fecha2)
    return this.scheduleRepository.query(
      `SELECT * FROM schedule WHERE userId = ? AND fecha BETWEEN ? AND ?`,
      [ userId,fecha1, fecha2],
    );    
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

  async update(userId: number, data: Partial<Schedule>): Promise<void> {
    try {
      console.log(data)
      await this.scheduleRepository.update(userId, data);
    } catch (error) {
      console.error("Error al actualizar los datos del registro", error);
      throw new Error("No se pudo actualizar el registro del usuario.");
    }
  }

  async findLastSchedule(userId: number): Promise<Schedule | undefined> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { userId: userId},
        order: {fecha: 'DESC'},
      });
      console.log(schedule)
      return schedule;
    } catch (error) {
      console.error('No existen registros', error);
      throw error;
    }
  }
}