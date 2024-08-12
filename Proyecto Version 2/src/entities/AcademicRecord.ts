import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Student } from "./Student";

@Entity()
export class AcademicRecord {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Student, student => student.academicRecords)
    student!: Student;

    @Column()
    subject!: string;

    @Column()
    academicYear!: number;

    @Column()
    semester!: number;

    @Column('float')
    grade!: number;

    @Column({ nullable: true })
    teacherComments!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}