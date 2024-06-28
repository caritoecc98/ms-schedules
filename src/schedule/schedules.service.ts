import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { Schedule } from './entities/schedule.entity';
import { findDatesUserId } from './functions/utilsSchedule/findDatesUserId';
import { WorkReport } from 'src/workReport/entity/workReport.entity';
import { WorkReportService } from '../workReport/workReports.service';
import { DailyReportForAll } from 'src/workReport/entity/dailyReport.entity';
import { getAllUsers } from './functions/utilsSchedule/getAllUsers';
import { findReportRange } from './functions/utilsReport/findReportRange';
import { calculateHoursForDate } from './functions/utilsReport/calculateHoursForDate';
import { calculateDailyHours } from './functions/utilsReport/calculateDailyHours';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(DailyReportForAll)
    private readonly dailyReportForAllRepository: Repository<DailyReportForAll>,
    @InjectRepository(WorkReport)
    private readonly workReportRepository: Repository<WorkReport>,
    private readonly workReportService: WorkReportService,
  ) {}

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
    return await this.scheduleRepository.find({where: {userId: userId},});
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
    return this.scheduleRepository.query(`SELECT * FROM schedule WHERE userId = ? AND fecha BETWEEN ? AND ?`,
      [userId, fecha1, fecha2], );}

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

  async updateSchedule(id: number, data: Partial<Schedule>): Promise<void> {
    try {
      console.log(data)
      await this.scheduleRepository.update(id, data);
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

  async findAllDatesByUserId(userId: number): Promise<Date[]> {
    return findDatesUserId(this.scheduleRepository, userId);
  }

  async findAllUsers(): Promise<number[]> {
    return getAllUsers(this.scheduleRepository);
  }
  
  async updateReport(): Promise<void> {
    try {
      await this.calculateAllUsersHours();
      console.log('Actualizando horas trabajadas por cada usuario');
      await this.calculateDailyHours();
      console.log('Cálculo total de horas por día');
    } catch (error) {
      console.error('Error al actualizar los reportes:', error);
      throw new Error('Error al actualizar los reportes.');
    }
  }
  
  async calculateAllUsersHours(): Promise<void> {
    console.log("Calculando reporte de todos los usuarios");
    try {
      const users = await this.findAllUsers();
      for(const user of users){
        this.calculateHours(user)
      }
      console.log('Cálculo de horas completado para todos los usuarios');
    } catch (error) {
      console.error('Error al calcular las horas para todos los usuarios:', error);
      throw new Error('No se pudieron calcular las horas para todos los usuarios.');
    }
  }

  async getWorkReport(id: number): Promise<WorkReport[]> {
    return this.scheduleRepository.query(`SELECT * FROM schedule WHERE userId`,[id])
  }

  async calculateHours(userId: number): Promise<void> {
    console.log("Calculando horas");
    try {
      const dates = await findDatesUserId(this.scheduleRepository, userId);
      console.log('Fechas obtenidas (calculate hours):', dates);
      for (const date of dates) {
        await calculateHoursForDate(this.scheduleRepository, this.workReportService, userId, date);
      }
      console.log('Horas actualizadas');
    }catch (error) {
      console.error('Error al calcular las horas:', error);
      throw new Error('No se pudieron calcular las horas.');
    }
  }

  async calculateDailyHours(): Promise<void> {
    console.log("Calculando horas");
    try {
      await calculateDailyHours(this.dailyReportForAllRepository, this.workReportRepository);
    } 
    catch (error) {
      console.error('Error al calcular las horas:', error);
      throw new Error('No se pudieron calcular las horas.');
    }
  }

  async workReport(): Promise<WorkReport[]> {
    return this.workReportRepository.find();
  }

  async dailyReport(): Promise<DailyReportForAll[]> {
    return this.dailyReportForAllRepository.find();
  }
  
  async workReportRange(startDate: string, endDate: string) {
    return findReportRange(this.workReportRepository, startDate, endDate);
  }

  async dailyReportRange(startDate: string, endDate: string) {
    return findReportRange(this.dailyReportForAllRepository, startDate, endDate);
  }
}
