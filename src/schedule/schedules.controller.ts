import { Controller, Post, Get, Body, Query, Param, Delete, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly schedulesService: SchedulesService) {}

  //@UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto) {
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
  
  @Get('admin/range') 
  async findInRangeAdmin(
    @Query('userId') userId: number,
    @Query('fecha1') fecha1: string,
    @Query('fecha2') fecha2: string,
    @Query('role') role: string,
  ) {
    return this.schedulesService.scheduleRangeAdmin(userId ,fecha1, fecha2, role);
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



//////
}
