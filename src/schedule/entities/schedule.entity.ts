import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: number;

    @Column()
    tipo: string;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'time' })
    hora: string;

    @CreateDateColumn({ name: 'created_at' }) 
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' }) 
    updated_at: Date;
    
   // @Column({ type: 'date',  default: () => 'CURRENT_TIMESTAMP'})
  //  date: Date;

   // @Column({ type: 'time',  default: () => 'CURRENT_TIME' })
  //  time: string;
  
   // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   // createdAt?: string;

}