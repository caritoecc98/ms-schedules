import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class WorkReport {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: number;

    @Column({ type: 'date' })
    dateReport: Date;

    @Column()
    hours: number;

    @Column()
    minutes: number;
}