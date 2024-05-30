import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
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
