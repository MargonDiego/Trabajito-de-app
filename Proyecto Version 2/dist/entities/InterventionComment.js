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
exports.InterventionComment = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Intervention_1 = require("./Intervention");
let InterventionComment = class InterventionComment {
};
exports.InterventionComment = InterventionComment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InterventionComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Intervention_1.Intervention, intervention => intervention.comments),
    __metadata("design:type", Intervention_1.Intervention)
], InterventionComment.prototype, "intervention", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], InterventionComment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], InterventionComment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InterventionComment.prototype, "createdAt", void 0);
exports.InterventionComment = InterventionComment = __decorate([
    (0, typeorm_1.Entity)()
], InterventionComment);
