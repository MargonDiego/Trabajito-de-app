"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
router.get('/verify-token', authMiddleware_1.authenticateToken, authController_1.verifyToken);
exports.default = router;
