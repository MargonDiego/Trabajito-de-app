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
exports.deleteInterventionComment = exports.updateInterventionComment = exports.getInterventionComments = exports.addInterventionComment = exports.getInterventionsByStudent = exports.deleteIntervention = exports.updateIntervention = exports.createIntervention = exports.getInterventionById = exports.getAllInterventions = void 0;
const typeorm_1 = require("typeorm");
const Intervention_1 = require("../entities/Intervention");
const InterventionComment_1 = require("../entities/InterventionComment");
const Student_1 = require("../entities/Student");
const User_1 = require("../entities/User");
const getAllInterventions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interventionRepository = (0, typeorm_1.getRepository)(Intervention_1.Intervention);
        const interventions = yield interventionRepository.find({
            relations: ['student', 'informer', 'responsible'],
        });
        res.json(interventions);
    }
    catch (error) {
        console.error('Error fetching all interventions:', error);
        res.status(500).json({ message: 'Error al obtener las intervenciones' });
    }
});
exports.getAllInterventions = getAllInterventions;
const getInterventionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const { id } = req.params;
        const interventionRepository = (0, typeorm_1.getRepository)(Intervention_1.Intervention);
        const intervention = yield interventionRepository.findOne({
            where: { id: Number(id) },
            relations: ['student', 'informer', 'informer.profile', 'responsible', 'responsible.profile'],
        });
        if (!intervention) {
            return res.status(404).json({ message: 'Intervención no encontrada' });
        }
        const transformedIntervention = Object.assign(Object.assign({}, intervention), { informer: intervention.informer
                ? {
                    id: intervention.informer.id,
                    email: intervention.informer.email,
                    role: intervention.informer.role,
                    staffType: intervention.informer.staffType,
                    firstName: (_a = intervention.informer.profile) === null || _a === void 0 ? void 0 : _a.firstName,
                    lastName: (_b = intervention.informer.profile) === null || _b === void 0 ? void 0 : _b.lastName,
                    position: (_c = intervention.informer.profile) === null || _c === void 0 ? void 0 : _c.position,
                    department: (_d = intervention.informer.profile) === null || _d === void 0 ? void 0 : _d.department,
                }
                : null, responsible: intervention.responsible
                ? {
                    id: intervention.responsible.id,
                    email: intervention.responsible.email,
                    role: intervention.responsible.role,
                    staffType: intervention.responsible.staffType,
                    firstName: (_e = intervention.responsible.profile) === null || _e === void 0 ? void 0 : _e.firstName,
                    lastName: (_f = intervention.responsible.profile) === null || _f === void 0 ? void 0 : _f.lastName,
                    position: (_g = intervention.responsible.profile) === null || _g === void 0 ? void 0 : _g.position,
                    department: (_h = intervention.responsible.profile) === null || _h === void 0 ? void 0 : _h.department,
                }
                : null });
        res.json(transformedIntervention);
    }
    catch (error) {
        console.error('Error fetching intervention by ID:', error);
        res.status(500).json({ message: 'Error al obtener la intervención' });
    }
});
exports.getInterventionById = getInterventionById;
const createIntervention = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interventionRepository = (0, typeorm_1.getRepository)(Intervention_1.Intervention);
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const { student, informer, responsible, title, description, type, status, priority, dateReported, interventionScope, actionsTaken, outcomeEvaluation, followUpDate, parentFeedback, requiresExternalReferral, externalReferralDetails, } = req.body;
        if (!student || !informer || !responsible) {
            return res.status(400).json({ message: 'Student, informer, and responsible are required' });
        }
        const studentEntity = yield studentRepository.findOne({ where: { id: Number(student) } });
        const informerEntity = yield userRepository.findOne({ where: { id: Number(informer) } });
        const responsibleEntity = yield userRepository.findOne({ where: { id: Number(responsible) } });
        if (!studentEntity || !informerEntity || !responsibleEntity) {
            return res.status(400).json({ message: 'Student, informer, or responsible not found' });
        }
        const newIntervention = interventionRepository.create({
            student: studentEntity,
            informer: informerEntity,
            responsible: responsibleEntity,
            title,
            description,
            type,
            status,
            priority: Number(priority),
            dateReported: new Date(dateReported),
            interventionScope,
            actionsTaken: actionsTaken ? actionsTaken.map((action) => action.trim()) : [],
            outcomeEvaluation,
            followUpDate: followUpDate ? new Date(followUpDate) : null,
            parentFeedback,
            requiresExternalReferral: Boolean(requiresExternalReferral),
            externalReferralDetails,
        });
        const result = yield interventionRepository.save(newIntervention);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating intervention:', error);
        res.status(400).json({ message: 'Error creating intervention', error: error.message });
    }
});
exports.createIntervention = createIntervention;
const updateIntervention = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const interventionRepository = (0, typeorm_1.getRepository)(Intervention_1.Intervention);
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        let intervention = yield interventionRepository.findOne({
            where: { id: Number(id) },
            relations: ['student', 'informer', 'responsible', 'comments'],
        });
        if (!intervention) {
            return res.status(404).json({ message: 'Intervención no encontrada' });
        }
        if (req.body.responsible) {
            const responsible = yield userRepository.findOne({ where: { id: Number(req.body.responsible) } });
            if (responsible) {
                intervention.responsible = responsible;
            }
        }
        if (req.body.informer) {
            const informer = yield userRepository.findOne({ where: { id: Number(req.body.informer) } });
            if (informer) {
                intervention.informer = informer;
            }
        }
        if (req.body.student) {
            const student = yield studentRepository.findOne({ where: { id: Number(req.body.student) } });
            if (student) {
                intervention.student = student;
            }
        }
        Object.assign(intervention, req.body);
        const result = yield interventionRepository.save(intervention);
        const updatedIntervention = yield interventionRepository.findOne({
            where: { id: Number(id) },
            relations: ['student', 'informer', 'responsible', 'comments'],
        });
        res.json(updatedIntervention);
    }
    catch (error) {
        console.error('Error updating intervention:', error);
        res.status(500).json({ message: 'Error al actualizar la intervención', error: error.message });
    }
});
exports.updateIntervention = updateIntervention;
const deleteIntervention = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const interventionRepository = (0, typeorm_1.getRepository)(Intervention_1.Intervention);
        const intervention = yield interventionRepository.findOne({
            where: { id: Number(id) },
        });
        if (!intervention) {
            return res.status(404).json({ message: 'Intervención no encontrada' });
        }
        yield interventionRepository.remove(intervention);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting intervention:', error);
        res.status(500).json({ message: 'Error al eliminar la intervención' });
    }
});
exports.deleteIntervention = deleteIntervention;
const getInterventionsByStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const interventionRepository = (0, typeorm_1.getRepository)(Intervention_1.Intervention);
        const interventions = yield interventionRepository.find({
            where: { student: { id: Number(studentId) } },
            relations: ['informer', 'responsible'],
        });
        res.json(interventions);
    }
    catch (error) {
        console.error('Error fetching interventions by student:', error);
        res.status(500).json({ message: 'Error al obtener las intervenciones del estudiante' });
    }
});
exports.getInterventionsByStudent = getInterventionsByStudent;
// src/controllers/interventionController.ts
const addInterventionComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { userId, content } = req.body;
        // Validate that id and userId are valid numbers
        const interventionId = Number(id);
        const userIdNumber = Number(userId);
        if (isNaN(interventionId) || isNaN(userIdNumber)) {
            return res.status(400).json({ message: 'ID de intervención o usuario inválido' });
        }
        const interventionRepository = (0, typeorm_1.getRepository)(Intervention_1.Intervention);
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const commentRepository = (0, typeorm_1.getRepository)(InterventionComment_1.InterventionComment);
        const intervention = yield interventionRepository.findOne({
            where: { id: interventionId },
        });
        const user = yield userRepository.findOne({
            where: { id: userIdNumber },
            relations: ['profile'],
        });
        if (!intervention || !user) {
            return res.status(404).json({ message: 'Intervención o usuario no encontrado' });
        }
        const newComment = commentRepository.create({
            intervention,
            user,
            content,
        });
        yield commentRepository.save(newComment);
        // Transform the comment before sending it
        const transformedComment = {
            id: newComment.id,
            content: newComment.content,
            createdAt: newComment.createdAt,
            user: {
                id: user.id,
                firstName: (_a = user.profile) === null || _a === void 0 ? void 0 : _a.firstName,
                lastName: (_b = user.profile) === null || _b === void 0 ? void 0 : _b.lastName,
            },
        };
        res.status(201).json(transformedComment);
    }
    catch (error) {
        console.error('Error adding intervention comment:', error);
        res.status(500).json({ message: 'Error al añadir el comentario', error: error.message });
    }
});
exports.addInterventionComment = addInterventionComment;
const getInterventionComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { page = 1, pageSize = 10 } = req.query;
        const commentRepository = (0, typeorm_1.getRepository)(InterventionComment_1.InterventionComment);
        const [comments, total] = yield commentRepository.findAndCount({
            where: { intervention: { id: Number(id) } },
            relations: ['user', 'user.profile'],
            order: { createdAt: 'DESC' },
            take: Number(pageSize),
            skip: (Number(page) - 1) * Number(pageSize),
        });
        const transformedComments = comments.map((comment) => {
            var _a, _b;
            return ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: {
                    id: comment.user.id,
                    firstName: (_a = comment.user.profile) === null || _a === void 0 ? void 0 : _a.firstName,
                    lastName: (_b = comment.user.profile) === null || _b === void 0 ? void 0 : _b.lastName,
                },
            });
        });
        res.json({
            comments: transformedComments,
            total,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
        });
    }
    catch (error) {
        console.error('Error fetching intervention comments:', error);
        res.status(500).json({ message: 'Error al obtener los comentarios de la intervención' });
    }
});
exports.getInterventionComments = getInterventionComments;
// Add these new functions for editing and deleting comments
const updateInterventionComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id, commentId } = req.params;
        const { content } = req.body;
        const commentRepository = (0, typeorm_1.getRepository)(InterventionComment_1.InterventionComment);
        // Fetch the comment and include the user relation
        const comment = yield commentRepository.findOne({
            where: { id: Number(commentId), intervention: { id: Number(id) } },
            relations: ['user', 'user.profile'], // Ensure user and profile are included
        });
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        comment.content = content;
        yield commentRepository.save(comment);
        const updatedComment = {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            user: {
                id: comment.user.id,
                firstName: (_a = comment.user.profile) === null || _a === void 0 ? void 0 : _a.firstName,
                lastName: (_b = comment.user.profile) === null || _b === void 0 ? void 0 : _b.lastName,
            },
        };
        res.status(200).json(updatedComment);
    }
    catch (error) {
        console.error('Error updating intervention comment:', error);
        res.status(500).json({ message: 'Error al actualizar el comentario', error: error.message });
    }
});
exports.updateInterventionComment = updateInterventionComment;
const deleteInterventionComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, commentId } = req.params;
        const commentRepository = (0, typeorm_1.getRepository)(InterventionComment_1.InterventionComment);
        const comment = yield commentRepository.findOne({
            where: { id: Number(commentId), intervention: { id: Number(id) } },
        });
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        yield commentRepository.remove(comment);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting intervention comment:', error);
        res.status(500).json({ message: 'Error al eliminar el comentario', error: error.message });
    }
});
exports.deleteInterventionComment = deleteInterventionComment;
