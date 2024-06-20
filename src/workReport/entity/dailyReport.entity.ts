import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class DailyReportForAll{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    dateReport: Date;

    @Column()
    hours: number;

    @Column()
    minutes: number;
}