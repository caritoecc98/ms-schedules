import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions,Between,MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { Schedule } from './entities/schedule.entity';
import { findDatesUserId } from './functions/findDatesUserId';
import { WorkReport } from 'src/workReport/entity/workReport.entity';
import { CreateWorkReportDto } from '../workReport/dto/createWorkReport.dto';
import { WorkReportService } from '../workReport/workReports.service';
import { findDates } from './functions/findDates';
import * as moment from 'moment';
import { DailyReportForAll } from 'src/workReport/entity/dailyReport.entity';
import { CreateDailyReportDto } from 'src/workReport/dto/createDailyReport.dto';
import { getAllUsers } from './functions/getAllUsers';
import { date } from 'joi';

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


  async calculateHours(userId: number): Promise<void> {
    console.log("Calculando horas");
    try {
      const dates = await findDatesUserId(this.scheduleRepository, userId);
      console.log('Fechas obtenidas:', dates);
      for (const date of dates) {
        const scheduleE = await this.scheduleRepository.findOne({
          where: { userId: userId, fecha:date, tipo:"entrada"},
        });
        const scheduleS = await this.scheduleRepository.findOne({
          where: { userId: userId, fecha:date, tipo:"salida"},
        });
        
        console.log(scheduleE);
      if (scheduleE && scheduleS) {
        const horaE = moment(scheduleE.hora, 'HH:mm:ss');
        const horaS = moment(scheduleS.hora, 'HH:mm:ss');

        const duration = moment.duration(horaS.diff(horaE));
        const minutesDifference = duration.asMinutes();
        console.log(`Diferencia en minutos: ${minutesDifference}`);
        const horasFloat=Number((minutesDifference/60).toFixed(2))
        console.log(horasFloat)
        const createWorkReportDto = {
            userId,
            dateReport: date,
            hours: horasFloat,
            minutes: minutesDifference
          };
          const workReport = await this.workReportService.createWorkReport(createWorkReportDto)
        }
      }
      console.log('Horas actualizadas');
    } 
    catch (error) {
      console.error('Error al calcular las horas:', error);
      throw new Error('No se pudieron calcular las horas.');
    }
  }

  async calculateDailyHours(): Promise<void> {
    console.log("Calculando horas");
    try {
      await this.dailyReportForAllRepository.clear();
      const query = `
        SELECT dateReport, SUM(hours) as totalHours, SUM(minutes) as totalMinutes
        FROM work_report
        GROUP BY dateReport
      `;
      const reports = await this.workReportRepository.query(query);
      console.log('Resultados obtenidos:', reports);
      
      for (const report of reports) {
        const newDailyReport = new DailyReportForAll();
        newDailyReport.dateReport = report.dateReport;
        newDailyReport.hours = report.totalHours;
        newDailyReport.minutes = report.totalMinutes;
        await this.dailyReportForAllRepository.save(newDailyReport);
        console.log(`Reporte diario creado para la fecha ${report.dateReport}: ${report.totalHours} horas`);
      }
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
    const start= new Date(startDate)
    const end=new Date(endDate)
    try {
      const reports= await this.workReportRepository.find();
      console.log('todos xd');
      console.log('Resultados obtenidos:', reports);
      const reportsInRange = [];
      for(const report of reports){
        const format=new Date(report.dateReport)       
        console.log(format) 
        console.log(start)
        console.log(end)
        if(format>= start && format<= end ){
          console.log("IF xd")
          console.log(report)
          reportsInRange.push(report);
        }
      }

      return reportsInRange;
    } catch (error) {
      console.error('Error al consultar el rango de work_report:', error);
      throw new Error('Error al consultar el rango de work_report');
    }
  }

  async dailyReportRange(startDate: string, endDate: string) {
    const start= new Date(startDate)
    const end=new Date(endDate)
    try {
      const reports= await this.dailyReportForAllRepository.find();
      console.log('todos xd');
      console.log('Resultados obtenidos:', reports);
      const reportsInRange = [];
      for(const report of reports){
        const format=new Date(report.dateReport)       
        console.log(format) 
        console.log(start)
        console.log(end)
        if(format>= start && format<= end ){
          console.log("IF xd")
          console.log(reports)
          reportsInRange.push(report);
        }
      }
      return reportsInRange;
    } catch (error) {
      console.error('Error al consultar el rango de work_report:', error);
      throw new Error('Error al consultar el rango de work_report');
    }
  }
}
