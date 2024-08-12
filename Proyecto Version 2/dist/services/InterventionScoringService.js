"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterventionScoringService = void 0;
class InterventionScoringService {
    static calculateScore(intervention) {
        let score = 0;
        // Puntuación basada en la severidad
        switch (intervention.severity) {
            case "Bajo":
                score += 1;
                break;
            case "Medio":
                score += 2;
                break;
            case "Alto":
                score += 3;
                break;
            case "Crítico":
                score += 4;
                break;
        }
        // Puntuación basada en la duración
        const durationInDays = (intervention.endDate ? new Date(intervention.endDate) : new Date()).getTime() - new Date(intervention.startDate).getTime();
        score += Math.min(Math.floor(durationInDays / (1000 * 60 * 60 * 24 * 7)), 4); // Máximo 4 puntos por duración
        // Puntuación basada en el progreso (inverso)
        score += Math.floor((100 - intervention.progressPercentage) / 25);
        // Puntuación adicional si requiere seguimiento
        if (intervention.requiresFollowUp)
            score += 2;
        return score;
    }
}
exports.InterventionScoringService = InterventionScoringService;
