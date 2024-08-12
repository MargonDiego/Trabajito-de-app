import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IClass, IIntervention, IAcademicRecord } from "./EntityInterfaces";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    rut!: string;

    @Column({ unique: true, nullable: true })
    email!: string;

    @Column({ type: 'date' })
    birthDate!: Date;

    @Column()
    grade!: string;

    @Column()
    academicYear!: number;

    @Column({ nullable: true })
    guardian1Name!: string;

    @Column({ nullable: true })
    guardian1Contact!: string;

    @Column({ nullable: true })
    guardian2Name!: string;
    
    @Column({ nullable: true })
    guardian2Contact!: string;

    @Column({ nullable: true })
    address!: string;

    @Column({ nullable: true })
    healthInfo!: string;

    @Column({ default: 'Regular' })
    studentType!: string;

    @Column({ nullable: true })
    specialNeeds!: string;

    @Column({ nullable: true })
    medicalConditions!: string;

    @Column({ nullable: true })
    allergies!: string;

    @Column({ default: false })
    hasScholarship!: boolean;

    @Column({ nullable: true })
    scholarshipDetails!: string;

    @Column("simple-array", { nullable: true })
    emergencyContacts!: string[];

    @Column({ nullable: true })
    previousSchool!: string;

    @Column({ type: 'date', nullable: true })
    enrollmentDate!: Date | null;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne("Class", "students")
    currentClass!: IClass;

    @OneToMany("AcademicRecord", "student")
    academicRecords!: IAcademicRecord[];

    @OneToMany("Intervention", "student")
    interventions!: IIntervention[];
}