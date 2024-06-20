import { Controller, Post, Get, Body, Query,Req,Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { DailyReportForAll } from 'src/workReport/entity/dailyReport.entity';
import { WorkReport } from 'src/workReport/entity/workReport.entity';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    console.log("Create schedule")
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  //Get para mostrar todos los registros, falta crear el guards
  @Get('admin/allSchedules')
  async findAllAdmin() {
    return this.schedulesService.findAllAdmin();
  }

  @Get('admin/allSchedules2')
  async findAllAdmin2(@Query() query: { role:string, fecha1: string, fecha2: string }) {
      const { role, fecha1, fecha2 } = query;
      return this.schedulesService.findAllAdmin2(role, fecha1, fecha2);
  }

  //@Get('user/allSchedules')
  //async findAllUser(@Body() body: { userId : number, fecha1: string, fecha2: string }) {
  ///    const { userId, fecha1, fecha2 } = body;
  //    return this.schedulesService.findAllUser(userId,fecha1, fecha2);
  //}
  
  //@Get('admin/range') 
  //async findInRangeAdmin(
  //  @Query('userId') userId: number,
  //  @Query('fecha1') fecha1: string,
  //  @Query('fecha2') fecha2: string,
  //  @Query('role') role: string,
  //) {
  //  return this.schedulesService.scheduleRangeAdmin(userId ,fecha1, fecha2, role);
  //}

  @Get('rangeSchedules') 
  async findInRangeAdmin(
    @Query('fecha1') fecha1: string,
    @Query('fecha2') fecha2: string,
    @Query('role') role: string,
  ) {
  
    console.log(role)
    if (role === 'admin') {
      console.log("admin")
      console.log(fecha1)
      console.log(fecha2)
      return this.schedulesService.scheduleRangeAdmin(fecha1, fecha2);
    } else {
      console.log("user")
      return this.schedulesService.scheduleRangeAdmin(fecha1, fecha2);
    }
  }


  @Get('user/range') 
  async findInRange(
    @Query('userId') userId: number,
    @Query('fecha1') fecha1: string,
    @Query('fecha2') fecha2: string
  ) {
    return this.schedulesService.scheduleRange(userId ,fecha1, fecha2);
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

  @Patch(':id')
  async updateSchedule(@Param('id') id: number, @Body() updateScheduleDto: UpdateScheduleDto) {
    return await this.schedulesService.update(+id, updateScheduleDto);
  }

  @Post('calculateHours/:id')
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
