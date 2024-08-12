"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Añade esta línea
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Añade esta línea
const Student_1 = require("./entities/Student");
const Class_1 = require("./entities/Class");
const User_1 = require("./entities/User");
const Intervention_1 = require("./entities/Intervention");
const AcademicRecord_1 = require("./entities/AcademicRecord");
const Profile_1 = require("./entities/Profile");
const InterventionComment_1 = require("./entities/InterventionComment");
const interventionRoutes_1 = __importDefault(require("./routes/interventionRoutes"));
(0, typeorm_1.createConnection)({
    type: "sqlite",
    database: "database.sqlite",
    entities: [Student_1.Student, Class_1.Class, User_1.User, Intervention_1.Intervention, InterventionComment_1.InterventionComment, AcademicRecord_1.AcademicRecord, Profile_1.Profile],
    synchronize: true,
    logging: true,
}).then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));
    app.use(express_1.default.json());
    app.get("/", (req, res) => {
        res.send("API is running");
    });
    app.use("/api", studentRoutes_1.default);
    app.use("/api", userRoutes_1.default); // Añade esta línea
    app.use("/api", profileRoutes_1.default);
    app.use("/api", authRoutes_1.default);
    app.use('/api', interventionRoutes_1.default);
    // Añade esta línea
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
})).catch(error => {
    console.error("Error connecting to database:", error);
});
