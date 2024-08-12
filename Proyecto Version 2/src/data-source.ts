import "reflect-metadata"
import { DataSource } from "typeorm"
import { Intervention } from "./entities/Intervention"
import { Student } from "./entities/Student"
import { Class } from "./entities/Class"
import { User } from "./entities/User"
import { AcademicRecord } from "./entities/AcademicRecord"
import { Profile } from "./entities/Profile"
import { InterventionComment } from "./entities/InterventionComment"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: false,
    logging: false,
    entities: [Intervention, Student, Class, User, AcademicRecord, Profile, InterventionComment],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
})