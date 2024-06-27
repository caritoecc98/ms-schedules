import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions,Between,MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateWorkReportDto } from './dto/CreateWorkReport.dto';
import { WorkReport } from './entity/workReport.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { findReportRangeUserID } from 'src/schedule/functions/utilsReport/findReportRangeUserID';

@Injectable()
export class WorkReportService {
  constructor(
    @InjectRepository(WorkReport)
    private readonly workReportRepository: Repository<WorkReport>,
    
  ) {}
  
  async createWorkReport(createWorkReportDto: CreateWorkReportDto) {
    const { userId,dateReport,hours,minutes } = createWorkReportDto;
    console.log(userId , dateReport, hours,minutes);
    const workReport = await this.workReportRepository.findOne({ where: { userId, dateReport } });
    console.log(workReport)
    if (workReport) {
      workReport.hours=hours
      workReport.minutes=minutes
      await this.workReportRepository.save(workReport); 
    }
    else{
      const newWorkReport = this.workReportRepository.create(createWorkReportDto);
      return this.workReportRepository.save(newWorkReport);
    }
  }

  findAll() {
    return this.workReportRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  getWorkReportUser(userId: number, startDate: string, endDate: string) {
    return findReportRangeUserID(this.workReportRepository,userId, startDate, endDate);
  }

  getReportUser(id: number) {
    return `This action returns a #${id} user`;
  }
}