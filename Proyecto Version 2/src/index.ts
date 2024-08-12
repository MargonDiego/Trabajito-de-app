import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";
import userRoutes from "./routes/userRoutes";  // Añade esta línea
import profileRoutes from "./routes/profileRoutes";
import authRoutes from "./routes/authRoutes";   // Añade esta línea
import { Student } from "./entities/Student";
import { Class } from "./entities/Class";
import { User } from "./entities/User";
import { Intervention } from "./entities/Intervention";
import { AcademicRecord } from "./entities/AcademicRecord";
import { Profile } from "./entities/Profile";
import { InterventionComment } from "./entities/InterventionComment";
import interventionRoutes from './routes/interventionRoutes';




createConnection({
  type: "sqlite",
  database: "database.sqlite",
  entities: [Student, Class, User, Intervention, InterventionComment, AcademicRecord, Profile],
  synchronize: true,
  logging: true,
}).then(async connection => {
  const app = express();

  app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("API is running");
  });

  app.use("/api", studentRoutes);
  app.use("/api", userRoutes);  // Añade esta línea
  app.use("/api", profileRoutes);
  app.use("/api", authRoutes);
  app.use('/api', interventionRoutes);
  
  
  
  // Añade esta línea

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}).catch(error => {
  console.error("Error connecting to database:", error);
});