import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { User } from "./User";
  import { IStudent } from "./EntityInterfaces";
  import { InterventionComment } from "./InterventionComment";
  
  @Entity()
  export class Intervention {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne("Student", "interventions")
    student!: IStudent;
  
    @ManyToOne(() => User, (user) => user.reportedInterventions)
    informer!: User;
  
    @ManyToOne(() => User, (user) => user.assignedInterventions)
    responsible!: User;
  
    @Column()
    title!: string;
  
    @Column("text")
    description!: string;
  
    @Column({
      type: "simple-enum",
      enum: ["Comportamiento", "Académico", "Asistencia", "Salud", "Familiar", "Otro"],
      default: "Otro",
    })
    type!: "Comportamiento" | "Académico" | "Asistencia" | "Salud" | "Familiar" | "Otro";
  
    @Column({
      type: "simple-enum",
      enum: ["Pendiente", "En Proceso", "Resuelto", "Cerrado"],
      default: "Pendiente",
    })
    status!: "Pendiente" | "En Proceso" | "Resuelto" | "Cerrado";
  
    @Column()
    priority!: number;
  
    @Column({ type: "date" })
    dateReported!: Date;
  
    @Column({ type: "date", nullable: true })
    dateResolved?: Date | null;  // Changed to optional field
  
    @Column({
      type: "simple-enum",
      enum: ["Individual", "Grupal", "Familiar"],
      default: "Individual",
    })
    interventionScope!: "Individual" | "Grupal" | "Familiar";
  
    @ManyToMany(() => User)
    @JoinTable()
    involvedStaff!: User[];
  
    @Column("simple-array", { nullable: true })
    actionsTaken?: string[];  // Changed to optional field
  
    @Column({ nullable: true })
    outcomeEvaluation?: string;  // Changed to optional field
  
    @Column({ type: "date", nullable: true })
    followUpDate?: Date | null;  // Changed to optional field
  
    @Column({ nullable: true })
    parentFeedback?: string;  // Changed to optional field
  
    @Column({ default: false })
    requiresExternalReferral!: boolean;
  
    @Column({ nullable: true })
    externalReferralDetails?: string;  // Changed to optional field
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  
    @OneToMany(() => InterventionComment, (comment) => comment.intervention)
    comments!: InterventionComment[];
  }
  