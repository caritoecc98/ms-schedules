import { Controller, Post, Get, Body, Query,Req,Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { UpdateScheduleDtoId } from './dto/updateScheduleId.dto';
import { DailyReportForAll } from 'src/workReport/entity/dailyReport.entity';
import { WorkReport } from 'src/workReport/entity/workReport.entity';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AuthGuardSchedule } from 'src/auth/guard/authSchedule.guard';
import { Admin } from 'typeorm';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(AuthGuardSchedule)
  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    console.log("Create schedule")
    return this.schedulesService.create(createScheduleDto);
  }

  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }
  
  @UseGuards(RolesGuard)
  @Get('admin/allSchedules')
  async findAllAdmin() {
    return this.schedulesService.findAllAdmin();
  }

  @UseGuards(RolesGuard)
  @Get('rangeSchedules') 
  async findInRangeAdmin(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('role') role: string,
  ) {
  
    console.log(role)
    if (role === 'admin') {
      console.log("admin")
      console.log(startDate)
      console.log(endDate)
      return this.schedulesService.scheduleRangeAdmin(startDate, endDate);
    } else {
      console.log("user")
      return this.schedulesService.scheduleRangeAdmin(startDate, endDate);
    }
  }

  @Get('user/range') 
  async findInRange(
    @Query('userId') userId: number,
    @Query('fecha1') startDate: string,
    @Query('fecha2') endDate: string
  ) {
    return this.schedulesService.scheduleRange(userId ,startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: number) {
    return this.schedulesService.findAllByUserId(userId);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }

  @Patch('location/:userId')
  async updateLocation(@Param('userId') userId: number, @Body() updateUserDto: UpdateScheduleDto) {
    const schedule= await this.schedulesService.findLastSchedule(userId)
    return await this.schedulesService.update(schedule.id, updateUserDto);
  }
  
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateScheduleDto) {
    return await this.schedulesService.update(+id, updateUserDto);
  }

  @Patch('update/:id')
  async updateSchedule(@Param('id') id: number, @Body() updateScheduleDtoId: UpdateScheduleDtoId) {
    return await this.schedulesService.update(+id, updateScheduleDtoId);
  }

  @Get('getWorkReport/:id')
  async getWorkReport(@Param('id') id: number) {
    return await this.schedulesService.getWorkReport(+id)
  }

  @Post('Hours/:id')
  async calculateHours(@Param('id') id: number) {
    return await this.schedulesService.calculateHours(+id)
  }

  @Post('calculateDailyHours')
  async calculateDailyHours() {
    return await this.schedulesService.calculateDailyHours()
  }  

  @Post('calculateAllUsersHours')
  async calculateAllUsersHours() {
    return await this.schedulesService.calculateAllUsersHours()
  }  

  @Post('updateReport')
  async updateReport() {
    return this.schedulesService.updateReport();
  }

  @Post('workReport')
  workReport(): Promise<WorkReport[]> {
    return this.schedulesService.workReport();
  }

  @Post('dailyReport')
  dailyReport(): Promise<DailyReportForAll[]> {
    return this.schedulesService.dailyReport();
  }

  @Post('workReportRange') 
  async workReportRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.schedulesService.workReportRange(startDate, endDate);
  }

  @Post('dailyReportRange') 
  async dailyReportRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.schedulesService.dailyReportRange(startDate, endDate);
  }
}
