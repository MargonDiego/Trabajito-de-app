import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';
import { User } from '../entities/User';
import { Profile } from '../entities/Profile';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { validate } from 'class-validator';

// Create a new user with profile
export const createUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, rut } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName || !rut) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    await getManager().transaction(async transactionalEntityManager => {
      const userRepository = transactionalEntityManager.getRepository(User);
      const profileRepository = transactionalEntityManager.getRepository(Profile);

      // Check if the email already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "El correo electrónico ya está registrado. Por favor, utilice otro." });
      }

      // Check if the RUT already exists
      const existingProfile = await profileRepository.findOne({ where: { rut } });
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
      const profileErrors = await validate(profile);
      if (profileErrors.length > 0) {
        const errorMessages = profileErrors.map(error => Object.values(error.constraints || {})).flat();
        return res.status(400).json({ message: "Error en los datos del perfil", errors: errorMessages });
      }

      // Save the profile
      await profileRepository.save(profile);

      // Create the user
      const user = userRepository.create({
        email,
        password: await bcrypt.hash(password, 10),
        role: 'user', // Default role
        profile,
        // Predefined fields
        isActive: true,
        staffType: null,
        subjectsTeaching: [],
        specializations: '',
      });

      // Validate the user
      const userErrors = await validate(user);
      if (userErrors.length > 0) {
        const errorMessages = userErrors.map(error => Object.values(error.constraints || {})).flat();
        return res.status(400).json({ message: "Error en los datos del usuario", errors: errorMessages });
      }

      // Save the user
      await userRepository.save(user);

      res.status(201).json({ message: "Usuario creado exitosamente", userId: user.id });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error al crear el usuario. Por favor, inténtelo de nuevo más tarde." });
  }
};

// Fetch all users with their profiles
export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);

    // Fetch users with their profiles
    const users = await userRepository.find({ relations: ['profile'] });

    res.json(users.map(user => ({
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
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        position: user.profile?.position,
        department: user.profile?.department,
        rut: user.profile?.rut,
        phoneNumber: user.profile?.phoneNumber,
        birthDate: user.profile?.birthDate,
        address: user.profile?.address,
        emergencyContact: user.profile?.emergencyContact,
        createdAt: user.profile?.createdAt,
        updatedAt: user.profile?.updatedAt
      }
    })));
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const {
        firstName, lastName, email, rut, position, department, phoneNumber,
        birthDate, address, emergencyContact, hireDate, specializations,
        isActive, staffType, subjectsTeaching, role
      } = req.body;
  
      const userRepository = getRepository(User);
      const profileRepository = getRepository(Profile);
  
      const user = await userRepository.findOne({ where: { id }, relations: ['profile'] });
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Update user fields
      user.email = email;
      user.isActive = isActive;
      user.specializations = specializations;
      user.hireDate = hireDate ? dayjs(hireDate, 'DD-MM-YYYY').toDate() : user.hireDate; // Keep existing date if null
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
      user.profile.birthDate = birthDate ? dayjs(birthDate, 'DD-MM-YYYY').toDate() : user.profile.birthDate; // Keep existing date if null
      user.profile.address = address;
  
      // Validate the user and profile
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ message: "Error de validación", errors });
      }
  
      await userRepository.save(user);
  
      res.json({ message: 'Usuario actualizado exitosamente', user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: "Error al actualizar el usuario", error: (error as Error).message });
    }
  };

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id }, relations: ['profile'] });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Delete the user (this should also delete the associated profile due to cascade)
    await userRepository.remove(user);

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Error al eliminar el usuario", error: (error as Error).message });
  }
};

// Fetch a user by ID with profile details
export const getUserById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id }, relations: ['profile'] });
  
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
        hireDate: user.hireDate ? dayjs(user.hireDate).format('DD-MM-YYYY') : null,
        emergencyContact: user.emergencyContact,
        profile: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          rut: user.profile.rut,
          position: user.profile.position,
          department: user.profile.department,
          phoneNumber: user.profile.phoneNumber,
          birthDate: user.profile.birthDate ? dayjs(user.profile.birthDate).format('DD-MM-YYYY') : null,
          address: user.profile.address,
        }
      };
  
      res.json(userResponse);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  };
