"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Intervention_1 = require("./entities/Intervention");
const Student_1 = require("./entities/Student");
const Class_1 = require("./entities/Class");
const User_1 = require("./entities/User");
const AcademicRecord_1 = require("./entities/AcademicRecord");
const Profile_1 = require("./entities/Profile");
const InterventionComment_1 = require("./entities/InterventionComment");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: false,
    logging: false,
    entities: [Intervention_1.Intervention, Student_1.Student, Class_1.Class, User_1.User, AcademicRecord_1.AcademicRecord, Profile_1.Profile, InterventionComment_1.InterventionComment],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
});
