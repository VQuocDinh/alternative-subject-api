import db from '../models';
import { Op } from 'sequelize';

class DrugInteractionService {
  async checkDrugInteractions(selectedDrugs, newDrug) {
    try {
      if (selectedDrugs.length === 0) {
        return {
          success: true,
          hasInteractions: false,
          data: {
            interactions: [],
            summary: {
              total: 0,
              contraindicated: 0,
              major: 0,
              moderate: 0,
              minor: 0,
            },
          },
        };
      }

      const interactionConditions = selectedDrugs.map((drug) => ({
        [Op.or]: [
          {
            [Op.and]: {
              medicine_id_1: drug.id,
              medicine_id_2: newDrug,
            },
          },
          {
            [Op.and]: {
              medicine_id_1: newDrug,
              medicine_id_2: drug.id,
            },
          },
        ],
      }));

      const interactions = await db.DrugInteractions.findAll({
        where: {
          [Op.or]: interactionConditions,
        },
        include: [
          {
            model: db.Medicine,
            as: 'Medicine1',
          },
          {
            model: db.Medicine,
            as: 'Medicine2',
          },
        ],
      });

      const categorizedInteractions = {
        CONTRAINDICATED: [],
        MAJOR: [],
        MODERATE: [],
        MINOR: [],
      };

      interactions.forEach((interaction) => {
        const interactionDetail = {
          id: interaction.id,
          medicine1: interaction.Medicine1.name,
          medicine2: interaction.Medicine2.name,
          severity_level: interaction.severity_level,
          description: interaction.description,
          effects: interaction.effects,
          recommendations: interaction.recommendations,
        };

        categorizedInteractions[interaction.severity_level].push(interactionDetail);
      });

      const summary = {
        total: interactions.length,
        contraindicated: categorizedInteractions.CONTRAINDICATED.length,
        major: categorizedInteractions.MAJOR.length,
        moderate: categorizedInteractions.MODERATE.length,
        minor: categorizedInteractions.MINOR.length,
      };

      return {
        success: true,
        hasInteractions: interactions.length > 0,
        data: {
          newDrug: newDrug.name,
          interactions: categorizedInteractions,
          summary: summary,
          canAdd: categorizedInteractions.CONTRAINDICATED.length === 0,
        },
      };
    } catch (error) {
      throw new Error(`Error checking drug interactions: ${error.message}`);
    }
  }
}

const drugInteractionService = new DrugInteractionService();
export default drugInteractionService;
