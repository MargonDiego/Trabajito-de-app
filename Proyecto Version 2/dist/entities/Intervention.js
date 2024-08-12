"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intervention = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const InterventionComment_1 = require("./InterventionComment");
let Intervention = class Intervention {
};
exports.Intervention = Intervention;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Intervention.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("Student", "interventions"),
    __metadata("design:type", Object)
], Intervention.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.reportedInterventions),
    __metadata("design:type", User_1.User)
], Intervention.prototype, "informer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.assignedInterventions),
    __metadata("design:type", User_1.User)
], Intervention.prototype, "responsible", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Intervention.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Intervention.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "simple-enum",
        enum: ["Comportamiento", "Académico", "Asistencia", "Salud", "Familiar", "Otro"],
        default: "Otro",
    }),
    __metadata("design:type", String)
], Intervention.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "simple-enum",
        enum: ["Pendiente", "En Proceso", "Resuelto", "Cerrado"],
        default: "Pendiente",
    }),
    __metadata("design:type", String)
], Intervention.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Intervention.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], Intervention.prototype, "dateReported", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Object)
], Intervention.prototype, "dateResolved", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "simple-enum",
        enum: ["Individual", "Grupal", "Familiar"],
        default: "Individual",
    }),
    __metadata("design:type", String)
], Intervention.prototype, "interventionScope", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Intervention.prototype, "involvedStaff", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Intervention.prototype, "actionsTaken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Intervention.prototype, "outcomeEvaluation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Object)
], Intervention.prototype, "followUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Intervention.prototype, "parentFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Intervention.prototype, "requiresExternalReferral", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Intervention.prototype, "externalReferralDetails", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Intervention.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Intervention.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InterventionComment_1.InterventionComment, (comment) => comment.intervention),
    __metadata("design:type", Array)
], Intervention.prototype, "comments", void 0);
exports.Intervention = Intervention = __decorate([
    (0, typeorm_1.Entity)()
], Intervention);
