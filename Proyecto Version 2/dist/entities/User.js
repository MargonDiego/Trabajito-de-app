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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Intervention_1 = require("./Intervention");
const Profile_1 = require("./Profile");
const Class_1 = require("./Class");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)({}, { message: "Email inválido" }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.MinLength)(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: ['Docente', 'Directivo', 'Asistente de la Educación', 'Profesional de Apoyo'],
        nullable: true
    }),
    __metadata("design:type", Object)
], User.prototype, "staffType", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "subjectsTeaching", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "specializations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "hireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Intervention_1.Intervention, intervention => intervention.informer),
    __metadata("design:type", Array)
], User.prototype, "reportedInterventions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Intervention_1.Intervention, intervention => intervention.responsible),
    __metadata("design:type", Array)
], User.prototype, "assignedInterventions", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Profile_1.Profile, profile => profile.user, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Profile_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Class_1.Class),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "classesTeaching", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
