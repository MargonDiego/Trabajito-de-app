"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const router = (0, express_1.Router)();
// Ruta para obtener un perfil por ID
router.get('/profiles/:id', profileController_1.getProfileById);
// Ruta para crear un nuevo perfil
router.post('/profiles', profileController_1.createProfile);
// Ruta para actualizar un perfil
router.put('/profiles/:id', profileController_1.updateProfile);
// Ruta para eliminar un perfil
router.delete('/profiles/:id', profileController_1.deleteProfile);
exports.default = router;
