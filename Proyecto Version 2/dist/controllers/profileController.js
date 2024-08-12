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
exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.getProfileById = void 0;
const typeorm_1 = require("typeorm");
const Profile_1 = require("../entities/Profile");
// Obtener un perfil por ID
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const profileRepository = (0, typeorm_1.getRepository)(Profile_1.Profile);
        const profile = yield profileRepository.findOne({ where: { id } });
        if (profile) {
            res.json(profile);
        }
        else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    }
    catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
});
exports.getProfileById = getProfileById;
// Crear un nuevo perfil
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profileRepository = (0, typeorm_1.getRepository)(Profile_1.Profile);
        const newProfile = profileRepository.create(req.body);
        const savedProfile = yield profileRepository.save(newProfile);
        res.status(201).json(savedProfile);
    }
    catch (error) {
        console.error('Error al crear el perfil:', error);
        res.status(500).json({ message: 'Error al crear el perfil' });
    }
});
exports.createProfile = createProfile;
// Actualizar un perfil
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const profileRepository = (0, typeorm_1.getRepository)(Profile_1.Profile);
        const profile = yield profileRepository.findOne({ where: { id } });
        if (profile) {
            Object.assign(profile, req.body);
            const updatedProfile = yield profileRepository.save(profile);
            res.json(updatedProfile);
        }
        else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    }
    catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
});
exports.updateProfile = updateProfile;
// Eliminar un perfil
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const profileRepository = (0, typeorm_1.getRepository)(Profile_1.Profile);
        const profile = yield profileRepository.findOne({ where: { id } });
        if (profile) {
            yield profileRepository.remove(profile);
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: 'Perfil no encontrado' });
        }
    }
    catch (error) {
        console.error('Error al eliminar el perfil:', error);
        res.status(500).json({ message: 'Error al eliminar el perfil' });
    }
});
exports.deleteProfile = deleteProfile;
