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
exports.getUserById = exports.deleteUser = exports.updateUser = exports.getUsers = exports.createUser = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Profile_1 = require("../entities/Profile");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dayjs_1 = __importDefault(require("dayjs"));
const class_validator_1 = require("class-validator");
// Create a new user with profile
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, rut } = req.body;
    // Validate required fields
    if (!email || !password || !firstName || !lastName || !rut) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    try {
        yield (0, typeorm_1.getManager)().transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const userRepository = transactionalEntityManager.getRepository(User_1.User);
            const profileRepository = transactionalEntityManager.getRepository(Profile_1.Profile);
            // Check if the email already exists
            const existingUser = yield userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "El correo electrónico ya está registrado. Por favor, utilice otro." });
            }
            // Check if the RUT already exists
            const existingProfile = yield profileRepository.findOne({ where: { rut } });
            if (existingProfile) {
                return res.status(400).json({ message: "El RUT ya está registrado. Si cree que esto es un error, por favor contacte al administrador." });
            }
            // Create the profile
            const profile = profileRepository.create({
                firstName,
                lastName,
                rut,
                // Predefined fields
                position: 'No especificado',
                department: 'No especificado',
            });
            // Validate the profile
            const profileErrors = yield (0, class_validator_1.validate)(profile);
            if (profileErrors.length > 0) {
                const errorMessages = profileErrors.map(error => Object.values(error.constraints || {})).flat();
                return res.status(400).json({ message: "Error en los datos del perfil", errors: errorMessages });
            }
            // Save the profile
            yield profileRepository.save(profile);
            // Create the user
            const user = userRepository.create({
                email,
                password: yield bcrypt_1.default.hash(password, 10),
                role: 'user', // Default role
                profile,
                // Predefined fields
                isActive: true,
                staffType: null,
                subjectsTeaching: [],
                specializations: '',
            });
            // Validate the user
            const userErrors = yield (0, class_validator_1.validate)(user);
            if (userErrors.length > 0) {
                const errorMessages = userErrors.map(error => Object.values(error.constraints || {})).flat();
                return res.status(400).json({ message: "Error en los datos del usuario", errors: errorMessages });
            }
            // Save the user
            yield userRepository.save(user);
            res.status(201).json({ message: "Usuario creado exitosamente", userId: user.id });
        }));
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error al crear el usuario. Por favor, inténtelo de nuevo más tarde." });
    }
});
exports.createUser = createUser;
// Fetch all users with their profiles
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // Fetch users with their profiles
        const users = yield userRepository.find({ relations: ['profile'] });
        res.json(users.map(user => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return ({
                id: user.id,
                email: user.email,
                role: user.role,
                staffType: user.staffType,
                specialization: user.specializations,
                hireDate: user.hireDate,
                emergencyContact: user.emergencyContact,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                profile: {
                    firstName: (_a = user.profile) === null || _a === void 0 ? void 0 : _a.firstName,
                    lastName: (_b = user.profile) === null || _b === void 0 ? void 0 : _b.lastName,
                    position: (_c = user.profile) === null || _c === void 0 ? void 0 : _c.position,
                    department: (_d = user.profile) === null || _d === void 0 ? void 0 : _d.department,
                    rut: (_e = user.profile) === null || _e === void 0 ? void 0 : _e.rut,
                    phoneNumber: (_f = user.profile) === null || _f === void 0 ? void 0 : _f.phoneNumber,
                    birthDate: (_g = user.profile) === null || _g === void 0 ? void 0 : _g.birthDate,
                    address: (_h = user.profile) === null || _h === void 0 ? void 0 : _h.address,
                    emergencyContact: (_j = user.profile) === null || _j === void 0 ? void 0 : _j.emergencyContact,
                    createdAt: (_k = user.profile) === null || _k === void 0 ? void 0 : _k.createdAt,
                    updatedAt: (_l = user.profile) === null || _l === void 0 ? void 0 : _l.updatedAt
                }
            });
        }));
    }
    catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { firstName, lastName, email, rut, position, department, phoneNumber, birthDate, address, emergencyContact, hireDate, specializations, isActive, staffType, subjectsTeaching, role } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const profileRepository = (0, typeorm_1.getRepository)(Profile_1.Profile);
        const user = yield userRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Update user fields
        user.email = email;
        user.isActive = isActive;
        user.specializations = specializations;
        user.hireDate = hireDate ? (0, dayjs_1.default)(hireDate, 'DD-MM-YYYY').toDate() : user.hireDate; // Keep existing date if null
        user.emergencyContact = emergencyContact;
        user.staffType = staffType;
        user.subjectsTeaching = subjectsTeaching || [];
        user.role = role;
        // Update profile
        if (!user.profile) {
            user.profile = profileRepository.create();
        }
        user.profile.firstName = firstName;
        user.profile.lastName = lastName;
        user.profile.rut = rut;
        user.profile.position = position;
        user.profile.department = department;
        user.profile.phoneNumber = phoneNumber;
        user.profile.birthDate = birthDate ? (0, dayjs_1.default)(birthDate, 'DD-MM-YYYY').toDate() : user.profile.birthDate; // Keep existing date if null
        user.profile.address = address;
        // Validate the user and profile
        const errors = yield (0, class_validator_1.validate)(user);
        if (errors.length > 0) {
            return res.status(400).json({ message: "Error de validación", errors });
        }
        yield userRepository.save(user);
        res.json({ message: 'Usuario actualizado exitosamente', user });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
    }
});
exports.updateUser = updateUser;
// Delete a user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Delete the user (this should also delete the associated profile due to cascade)
        yield userRepository.remove(user);
        res.json({ message: "Usuario eliminado exitosamente" });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: "Error al eliminar el usuario", error: error.message });
    }
});
exports.deleteUser = deleteUser;
// Fetch a user by ID with profile details
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const userResponse = {
            id: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            staffType: user.staffType,
            subjectsTeaching: user.subjectsTeaching || [],
            specializations: user.specializations,
            hireDate: user.hireDate ? (0, dayjs_1.default)(user.hireDate).format('DD-MM-YYYY') : null,
            emergencyContact: user.emergencyContact,
            profile: {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                rut: user.profile.rut,
                position: user.profile.position,
                department: user.profile.department,
                phoneNumber: user.profile.phoneNumber,
                birthDate: user.profile.birthDate ? (0, dayjs_1.default)(user.profile.birthDate).format('DD-MM-YYYY') : null,
                address: user.profile.address,
            }
        };
        res.json(userResponse);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
});
exports.getUserById = getUserById;
