import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Profile } from '../entities/Profile';

// Obtener un perfil por ID
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const profileRepository = getRepository(Profile);
    const profile = await profileRepository.findOne({ where: { id } });

    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Perfil no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

// Crear un nuevo perfil
export const createProfile = async (req: Request, res: Response) => {
  try {
    const profileRepository = getRepository(Profile);
    const newProfile = profileRepository.create(req.body);
    const savedProfile = await profileRepository.save(newProfile);
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error al crear el perfil:', error);
    res.status(500).json({ message: 'Error al crear el perfil' });
  }
};

// Actualizar un perfil
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const profileRepository = getRepository(Profile);
    const profile = await profileRepository.findOne({ where: { id } });

    if (profile) {
      Object.assign(profile, req.body);
      const updatedProfile = await profileRepository.save(profile);
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Perfil no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

// Eliminar un perfil
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const profileRepository = getRepository(Profile);
    const profile = await profileRepository.findOne({ where: { id } });

    if (profile) {
      await profileRepository.remove(profile);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Perfil no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el perfil:', error);
    res.status(500).json({ message: 'Error al eliminar el perfil' });
  }
};