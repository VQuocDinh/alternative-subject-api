import db from '../models/index.js';
import path from 'path';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import { BadRequestError, NotFoundError } from '../core/error.response.js';

class PatientService {
  static getAll = async ({ page = 0, limit = 20 }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;
    const { rows: patients, count } = await db.Patient.findAndCountAll({
      offset: offset,
      limit: limitNum,
      order: [['created_at', 'DESC']],
    });
    return {
      data: patients,
      meta: {
        currentPage: pageNum,
        itemsPerPage: limitNum,
        totalPages: Math.ceil(count / limitNum),
        totalItems: count,
      },
    };
  };

  static saveImageToFile = async (image, filePath) => {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, imageBuffer);
  };

  static recognizeFace = (imagePath) => {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['face_recognition.py', imagePath]);
      let output = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new BadRequestError('Error processing image'));
        } else {
          resolve(output.trim());
        }
      });
    });
  };

  static getById = async (patientId) => {
    const response = await db.Patient.findByPk(patientId);
    if (!response) {
      throw new NotFoundError('Patient not found');
    }
    return response;
  };

  static getByFace = async (image) => {
    const tempFileName = `temp_${Date.now()}.jpg`;
    const tempFilePath = path.join(__dirname, 'uploads', tempFileName);

    await this.saveImageToFile(image, tempFilePath);
    const patientId = await this.recognizeFace(tempFilePath);

    if (patientId && patientId !== 'Not found') {
      const patient = await this.getById(patientId);
      return patient;
    } else {
      throw new NotFoundError('Face not recognized or patient not found');
    }
  };

  static findByPk = async (patientId) => {
    const response = await db.Patient.findByPk(patientId);
    if (!response) {
      throw new NotFoundError('Patient not found');
    }
    return response;
  };

  static searchPatient = async (cccd) => {
    const response = await db.Patient.findAll({
      where: { cccd: cccd },
    });
    if (!response || response.length === 0) {
      throw new NotFoundError('Patient not found');
    }
    return response;
  };

  static deletePatient = async (patientId) => {
    const response = await db.Patient.update(
      {
        status: 0,
      },
      {
        where: { patient_id: patientId },
      }
    );
    if (!response) {
      throw new Error('Error deleting patient');
    }
    return response;
  };

  static addPatient = async (patientData) => {
    const response = await db.Patient.create(patientData);
    if (!response) {
      throw new Error('Error adding patient');
    }
    return response;
  };

  static editPatient = async (id, formValues) => {
    const response = await db.Patient.update(
      {
        email: formValues.email,
        phone: formValues.phone, // Corrected field name
        full_name: formValues.full_name, // Corrected field name
        gender: formValues.gender,
        dob: formValues.dob, // Corrected field name
      },
      {
        where: { id: id },
      }
    );
    if (!response) {
      throw new Error('Error editing patient');
    }
    return response;
  };
}

export default PatientService;
