import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
    OneToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
  } from "typeorm";
  import { IsEmail, MinLength } from "class-validator";
  import { Intervention } from "./Intervention";
  import { Profile } from "./Profile";
  import { Class } from "./Class";
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    @IsEmail({}, { message: "Email inválido" })
    email!: string;
  
    @Column()
    @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    password!: string;
  
    @Column({ default: 'user' })
    role!: string;
  
    @Column({
      type: 'simple-enum',
      enum: ['Docente', 'Directivo', 'Asistente de la Educación', 'Profesional de Apoyo'],
      nullable: true
    })
    staffType!: 'Docente' | 'Directivo' | 'Asistente de la Educación' | 'Profesional de Apoyo' | null;
  
    @Column("simple-array", { nullable: true })
    subjectsTeaching!: string[];
  
    @Column({ nullable: true })
    specializations!: string;
  
    @Column({ type: 'date', nullable: true })
    hireDate!: Date;
  
    @Column({ nullable: true })
    emergencyContact!: string;
  
    @Column({ default: true })
    isActive!: boolean;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  
    @OneToMany(() => Intervention, intervention => intervention.informer)
    reportedInterventions!: Intervention[];
  
    @OneToMany(() => Intervention, intervention => intervention.responsible)
    assignedInterventions!: Intervention[];
  
    @OneToOne(() => Profile, profile => profile.user, { cascade: true })
    @JoinColumn()
    profile!: Profile;
  
    @ManyToMany(() => Class)
    @JoinTable()
    classesTeaching!: Class[];
  }