import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Student } from "./Student";
import { User } from "./User";

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    academicYear!: number;

    @ManyToOne(() => User)
    homeRoomTeacher!: User;

    @OneToMany(() => Student, student => student.currentClass)
    students!: Student[];

    @Column({ type: 'simple-json', nullable: true })
    schedule!: { [key: string]: string };

    @Column({ nullable: true })
    classroomNumber!: string;

    @Column({ type: 'int', default: 0 })
    capacity!: number;
}