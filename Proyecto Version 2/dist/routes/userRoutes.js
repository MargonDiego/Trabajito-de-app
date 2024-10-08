"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/users', userController_1.createUser);
router.get('/users', authMiddleware_1.authenticateToken, userController_1.getUsers);
router.get('/users/:id', authMiddleware_1.authenticateToken, userController_1.getUserById);
router.put('/users/:id', authMiddleware_1.authenticateToken, userController_1.updateUser);
router.delete('/users/:id', authMiddleware_1.authenticateToken, userController_1.deleteUser);
exports.default = router;
