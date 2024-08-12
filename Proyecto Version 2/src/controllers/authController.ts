import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email }, relations: ['profile'] });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      userId: user.id, 
      role: user.role,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Error en el proceso de login" });
  }
};
export const verifyToken = async (req: Request, res: Response) => {
    // El token ya ha sido verificado por el middleware de autenticación
    // Si llegamos aquí, el token es válido
    res.status(200).json({ message: "Token válido" });
  };