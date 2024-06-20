import { Controller, Post, Get, Body, Query,Req,Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkReportService } from './workReports.service';
import { CreateWorkReportDto } from './dto/createWorkReport.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SchedulesService } from 'src/schedule/schedules.service';

@Controller('workReport')
export class WorkReportController {
  constructor(
    private readonly workReportService: WorkReportService, 
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  createWorkReport(@Body() createWorkReportDto: CreateWorkReportDto) {
    console.log("Create workReport")
    return this.workReportService.createWorkReport(createWorkReportDto);
  }

  @Get()
  findAll() {
    return this.workReportService.findAll();
  }

}