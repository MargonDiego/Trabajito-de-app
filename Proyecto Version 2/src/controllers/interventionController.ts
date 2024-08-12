import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Intervention } from '../entities/Intervention';
import { InterventionComment } from '../entities/InterventionComment';
import { Student } from '../entities/Student';
import { User } from '../entities/User';

export const getAllInterventions = async (req: Request, res: Response) => {
  try {
    const interventionRepository = getRepository(Intervention);
    const interventions = await interventionRepository.find({
      relations: ['student', 'informer', 'responsible'],
    });
    res.json(interventions);
  } catch (error) {
    console.error('Error fetching all interventions:', error);
    res.status(500).json({ message: 'Error al obtener las intervenciones' });
  }
};

export const getInterventionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const interventionRepository = getRepository(Intervention);

    const intervention = await interventionRepository.findOne({
      where: { id: Number(id) },
      relations: ['student', 'informer', 'informer.profile', 'responsible', 'responsible.profile'],
    });

    if (!intervention) {
      return res.status(404).json({ message: 'Intervención no encontrada' });
    }

    const transformedIntervention = {
      ...intervention,
      informer: intervention.informer
        ? {
            id: intervention.informer.id,
            email: intervention.informer.email,
            role: intervention.informer.role,
            staffType: intervention.informer.staffType,
            firstName: intervention.informer.profile?.firstName,
            lastName: intervention.informer.profile?.lastName,
            position: intervention.informer.profile?.position,
            department: intervention.informer.profile?.department,
          }
        : null,
      responsible: intervention.responsible
        ? {
            id: intervention.responsible.id,
            email: intervention.responsible.email,
            role: intervention.responsible.role,
            staffType: intervention.responsible.staffType,
            firstName: intervention.responsible.profile?.firstName,
            lastName: intervention.responsible.profile?.lastName,
            position: intervention.responsible.profile?.position,
            department: intervention.responsible.profile?.department,
          }
        : null,
    };

    res.json(transformedIntervention);
  } catch (error) {
    console.error('Error fetching intervention by ID:', error);
    res.status(500).json({ message: 'Error al obtener la intervención' });
  }
};

export const createIntervention = async (req: Request, res: Response) => {
  try {
    const interventionRepository = getRepository(Intervention);
    const studentRepository = getRepository(Student);
    const userRepository = getRepository(User);

    const {
      student,
      informer,
      responsible,
      title,
      description,
      type,
      status,
      priority,
      dateReported,
      interventionScope,
      actionsTaken,
      outcomeEvaluation,
      followUpDate,
      parentFeedback,
      requiresExternalReferral,
      externalReferralDetails,
    } = req.body;

    if (!student || !informer || !responsible) {
      return res.status(400).json({ message: 'Student, informer, and responsible are required' });
    }

    const studentEntity = await studentRepository.findOne({ where: { id: Number(student) } });
    const informerEntity = await userRepository.findOne({ where: { id: Number(informer) } });
    const responsibleEntity = await userRepository.findOne({ where: { id: Number(responsible) } });

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
      actionsTaken: actionsTaken ? actionsTaken.map((action: string) => action.trim()) : [],
      outcomeEvaluation,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      parentFeedback,
      requiresExternalReferral: Boolean(requiresExternalReferral),
      externalReferralDetails,
    });

    const result = await interventionRepository.save(newIntervention);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating intervention:', error);
    res.status(400).json({ message: 'Error creating intervention', error: (error as Error).message });
  }
};

export const updateIntervention = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const interventionRepository = getRepository(Intervention);
    const userRepository = getRepository(User);
    const studentRepository = getRepository(Student);

    let intervention = await interventionRepository.findOne({
      where: { id: Number(id) },
      relations: ['student', 'informer', 'responsible', 'comments'],
    });

    if (!intervention) {
      return res.status(404).json({ message: 'Intervención no encontrada' });
    }

    if (req.body.responsible) {
      const responsible = await userRepository.findOne({ where: { id: Number(req.body.responsible) } });
      if (responsible) {
        intervention.responsible = responsible;
      }
    }

    if (req.body.informer) {
      const informer = await userRepository.findOne({ where: { id: Number(req.body.informer) } });
      if (informer) {
        intervention.informer = informer;
      }
    }

    if (req.body.student) {
      const student = await studentRepository.findOne({ where: { id: Number(req.body.student) } });
      if (student) {
        intervention.student = student;
      }
    }

    Object.assign(intervention, req.body);

    const result = await interventionRepository.save(intervention);

    const updatedIntervention = await interventionRepository.findOne({
      where: { id: Number(id) },
      relations: ['student', 'informer', 'responsible', 'comments'],
    });

    res.json(updatedIntervention);
  } catch (error) {
    console.error('Error updating intervention:', error);
    res.status(500).json({ message: 'Error al actualizar la intervención', error: (error as Error).message });
  }
};

export const deleteIntervention = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const interventionRepository = getRepository(Intervention);
    const intervention = await interventionRepository.findOne({
      where: { id: Number(id) },
    });

    if (!intervention) {
      return res.status(404).json({ message: 'Intervención no encontrada' });
    }

    await interventionRepository.remove(intervention);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting intervention:', error);
    res.status(500).json({ message: 'Error al eliminar la intervención' });
  }
};

export const getInterventionsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const interventionRepository = getRepository(Intervention);

    const interventions = await interventionRepository.find({
      where: { student: { id: Number(studentId) } },
      relations: ['informer', 'responsible'],
    });

    res.json(interventions);
  } catch (error) {
    console.error('Error fetching interventions by student:', error);
    res.status(500).json({ message: 'Error al obtener las intervenciones del estudiante' });
  }
};

// src/controllers/interventionController.ts

export const addInterventionComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId, content } = req.body;
  
      // Validate that id and userId are valid numbers
      const interventionId = Number(id);
      const userIdNumber = Number(userId);
  
      if (isNaN(interventionId) || isNaN(userIdNumber)) {
        return res.status(400).json({ message: 'ID de intervención o usuario inválido' });
      }
  
      const interventionRepository = getRepository(Intervention);
      const userRepository = getRepository(User);
      const commentRepository = getRepository(InterventionComment);
  
      const intervention = await interventionRepository.findOne({
        where: { id: interventionId },
      });
      const user = await userRepository.findOne({
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
  
      await commentRepository.save(newComment);
  
      // Transform the comment before sending it
      const transformedComment = {
        id: newComment.id,
        content: newComment.content,
        createdAt: newComment.createdAt,
        user: {
          id: user.id,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
        },
      };
  
      res.status(201).json(transformedComment);
    } catch (error) {
      console.error('Error adding intervention comment:', error);
      res.status(500).json({ message: 'Error al añadir el comentario', error: (error as Error).message });
    }
  };  

export const getInterventionComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const commentRepository = getRepository(InterventionComment);

    const [comments, total] = await commentRepository.findAndCount({
      where: { intervention: { id: Number(id) } },
      relations: ['user', 'user.profile'],
      order: { createdAt: 'DESC' },
      take: Number(pageSize),
      skip: (Number(page) - 1) * Number(pageSize),
    });

    const transformedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        id: comment.user.id,
        firstName: comment.user.profile?.firstName,
        lastName: comment.user.profile?.lastName,
      },
    }));

    res.json({
      comments: transformedComments,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    });
  } catch (error) {
    console.error('Error fetching intervention comments:', error);
    res.status(500).json({ message: 'Error al obtener los comentarios de la intervención' });
  }
};

// Add these new functions for editing and deleting comments

export const updateInterventionComment = async (req: Request, res: Response) => {
    try {
      const { id, commentId } = req.params;
      const { content } = req.body;
  
      const commentRepository = getRepository(InterventionComment);
  
      // Fetch the comment and include the user relation
      const comment = await commentRepository.findOne({
        where: { id: Number(commentId), intervention: { id: Number(id) } },
        relations: ['user', 'user.profile'], // Ensure user and profile are included
      });
  
      if (!comment) {
        return res.status(404).json({ message: 'Comentario no encontrado' });
      }
  
      comment.content = content;
      await commentRepository.save(comment);
  
      const updatedComment = {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          firstName: comment.user.profile?.firstName,
          lastName: comment.user.profile?.lastName,
        },
      };
  
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error('Error updating intervention comment:', error);
      res.status(500).json({ message: 'Error al actualizar el comentario', error: (error as Error).message });
    }
  };
  

export const deleteInterventionComment = async (req: Request, res: Response) => {
  try {
    const { id, commentId } = req.params;

    const commentRepository = getRepository(InterventionComment);

    const comment = await commentRepository.findOne({
      where: { id: Number(commentId), intervention: { id: Number(id) } },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await commentRepository.remove(comment);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting intervention comment:', error);
    res.status(500).json({ message: 'Error al eliminar el comentario', error: (error as Error).message });
  }
};
