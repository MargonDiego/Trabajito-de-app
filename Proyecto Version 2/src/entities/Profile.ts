import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { IsNotEmpty, Matches } from "class-validator";
  import { User } from "./User";
  
  @Entity()
  export class Profile {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @OneToOne(() => User, user => user.profile)
    user!: User;
  
    @Column()
    @IsNotEmpty({ message: "El nombre es requerido" })
    firstName!: string;
  
    @Column()
    @IsNotEmpty({ message: "El apellido es requerido" })
    lastName!: string;
  
    @Column({ unique: true })
    @IsNotEmpty({ message: "El RUT es requerido" })
    @Matches(/^[0-9]{7,8}-[0-9K]$/, { message: "Formato de RUT inválido" })
    rut!: string;
  
    @Column({ nullable: true })
    position!: string;
  
    @Column({ nullable: true })
    department!: string;
  
    @Column({ nullable: true })
    phoneNumber!: string;
  
    @Column({ type: 'date', nullable: true })
    birthDate!: Date;
  
    @Column({ nullable: true })
    address!: string;
  
    @Column({ nullable: true })
    emergencyContact!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }