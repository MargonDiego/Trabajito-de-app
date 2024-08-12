import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Intervention } from "./Intervention";

@Entity()
export class InterventionComment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Intervention, intervention => intervention.comments)
    intervention!: Intervention;

    @ManyToOne(() => User)
    user!: User;

    @Column('text')
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;
}