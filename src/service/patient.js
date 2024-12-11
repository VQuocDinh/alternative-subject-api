import db from '../models/index.js';
import path from 'path';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import { BadRequestError, NotFoundError } from '../core/error.response.js';

class PatientService {
  getAll = async ({ page, limit }) => {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows: patients, count } = await db.Patient.findAndCountAll({
      offset: offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });
    return {
      data: patients,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
      },
    };
  };

  saveImageToFile = async (image, filePath) => {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, imageBuffer);
  };

  recognizeFace = (imagePath) => {
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

  getById = async (patientId) => {
    const response = await db.Patient.findByPk(patientId);
    console.log(response);
    if (!response) {
      throw new NotFoundError('Patient not found');
    }
    return response;
  };

  getByFace = async (image) => {
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

  findByPk = async (patientId) => {
    const response = await db.Patient.findByPk(patientId);
    if (!response) {
      throw new NotFoundError('Patient not found');
    }
    return response;
  };

  searchPatient = async (cccd) => {
    const response = await db.Patient.findAll({
      where: { cccd: cccd },
    });
    if (!response || response.length === 0) {
      throw new NotFoundError('Patient not found');
    }
    return response;
  };

  deletePatient = async (patientId) => {
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

  addPatient = async (patientData) => {
    const response = await db.Patient.create(patientData);
    if (!response) {
      throw new Error('Error adding patient');
    }
    return response;
  };

  editPatient = async (formValues) => {
    const response = await db.Patient.update(
      {
        email: formValues.email,
        phone_number: formValues.phone,
        full_name: formValues.fullName,
        gender: formValues.gender,
        date_of_birth: formValues.dateOfBirth,
        address: formValues.address,
        cccd: formValues.cccd,
        emergency_contact_name: formValues.emergency_contact_name,
        emergency_contact_name: formValues.emergency_contact_name,
      },
      {
        where: { patient_id: formValues.patientId },
      }
    );
    if (!response) {
      throw new Error('Error editing patient');
    }
    return response;
  };
}

export default new PatientService();
