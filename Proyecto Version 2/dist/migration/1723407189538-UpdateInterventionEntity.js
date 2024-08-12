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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInterventionEntity1723407189538 = void 0;
class UpdateInterventionEntity1723407189538 {
    constructor() {
        this.name = 'UpdateInterventionEntity1723407189538';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "temporary_intervention" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "type" varchar CHECK( "type" IN ('Comportamiento','Académico','Asistencia','Salud','Familiar','Otro') ) NOT NULL DEFAULT ('Otro'), "status" varchar CHECK( "status" IN ('Pendiente','En Proceso','Resuelto','Cerrado') ) NOT NULL DEFAULT ('Pendiente'), "priority" integer NOT NULL, "dateReported" date NOT NULL, "dateResolved" date, "interventionScope" varchar CHECK( "interventionScope" IN ('Individual','Grupal','Familiar') ) NOT NULL DEFAULT ('Individual'), "actionsTaken" text, "outcomeEvaluation" varchar, "followUpDate" date, "parentFeedback" varchar, "requiresExternalReferral" boolean NOT NULL DEFAULT (0), "externalReferralDetails" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "studentId" integer, "informerId" integer, "responsibleId" integer, "severity" varchar CHECK( "severity" IN ('Bajo','Medio','Alto','Crítico') ) NOT NULL DEFAULT ('Medio'), "tags" text NOT NULL, "progressPercentage" float NOT NULL DEFAULT (0), "outcome" varchar, "requiresFollowUp" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_0dd58774a6b31c4ce332f4e0c43" FOREIGN KEY ("responsibleId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_14721d58e583de4836559588023" FOREIGN KEY ("informerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_fae251d9845fc8e2ac5ea122888" FOREIGN KEY ("studentId") REFERENCES "student" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_intervention"("id", "title", "description", "type", "status", "priority", "dateReported", "dateResolved", "interventionScope", "actionsTaken", "outcomeEvaluation", "followUpDate", "parentFeedback", "requiresExternalReferral", "externalReferralDetails", "createdAt", "updatedAt", "studentId", "informerId", "responsibleId") SELECT "id", "title", "description", "type", "status", "priority", "dateReported", "dateResolved", "interventionScope", "actionsTaken", "outcomeEvaluation", "followUpDate", "parentFeedback", "requiresExternalReferral", "externalReferralDetails", "createdAt", "updatedAt", "studentId", "informerId", "responsibleId" FROM "intervention"`);
            yield queryRunner.query(`DROP TABLE "intervention"`);
            yield queryRunner.query(`ALTER TABLE "temporary_intervention" RENAME TO "intervention"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "intervention" RENAME TO "temporary_intervention"`);
            yield queryRunner.query(`CREATE TABLE "intervention" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "type" varchar CHECK( "type" IN ('Comportamiento','Académico','Asistencia','Salud','Familiar','Otro') ) NOT NULL DEFAULT ('Otro'), "status" varchar CHECK( "status" IN ('Pendiente','En Proceso','Resuelto','Cerrado') ) NOT NULL DEFAULT ('Pendiente'), "priority" integer NOT NULL, "dateReported" date NOT NULL, "dateResolved" date, "interventionScope" varchar CHECK( "interventionScope" IN ('Individual','Grupal','Familiar') ) NOT NULL DEFAULT ('Individual'), "actionsTaken" text, "outcomeEvaluation" varchar, "followUpDate" date, "parentFeedback" varchar, "requiresExternalReferral" boolean NOT NULL DEFAULT (0), "externalReferralDetails" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "studentId" integer, "informerId" integer, "responsibleId" integer, CONSTRAINT "FK_0dd58774a6b31c4ce332f4e0c43" FOREIGN KEY ("responsibleId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_14721d58e583de4836559588023" FOREIGN KEY ("informerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_fae251d9845fc8e2ac5ea122888" FOREIGN KEY ("studentId") REFERENCES "student" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "intervention"("id", "title", "description", "type", "status", "priority", "dateReported", "dateResolved", "interventionScope", "actionsTaken", "outcomeEvaluation", "followUpDate", "parentFeedback", "requiresExternalReferral", "externalReferralDetails", "createdAt", "updatedAt", "studentId", "informerId", "responsibleId") SELECT "id", "title", "description", "type", "status", "priority", "dateReported", "dateResolved", "interventionScope", "actionsTaken", "outcomeEvaluation", "followUpDate", "parentFeedback", "requiresExternalReferral", "externalReferralDetails", "createdAt", "updatedAt", "studentId", "informerId", "responsibleId" FROM "temporary_intervention"`);
            yield queryRunner.query(`DROP TABLE "temporary_intervention"`);
        });
    }
}
exports.UpdateInterventionEntity1723407189538 = UpdateInterventionEntity1723407189538;
