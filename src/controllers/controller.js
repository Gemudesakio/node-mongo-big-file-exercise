// src/controllers/controller.js
import fs from 'fs';
import csv from 'csv-parser';
import Records from '../models/records.model.js';
import path from 'path';

const BATCH_SIZE = 1000;

const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  const filePath = req.file.path;

  try {
    // 1) Parsear todo el CSV a un array de objetos
    const rows = await new Promise((resolve, reject) => {
      const temp = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          temp.push({
            id: Number(row.id),
            firstname: row.firstname,
            lastname: row.lastname,
            email: row.email,
            email2: row.email2,
            profession: row.profession,
          });
        })
        .on('end', () => resolve(temp))
        .on('error', (err) => reject(err));
    });

    // 2) Insertar en lotes de BATCH_SIZE
    let totalInserted = 0;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const inserted = await Records.insertMany(batch);
      totalInserted += inserted.length;
      console.log(`Inserted batch ${i/BATCH_SIZE + 1}, total so far: ${totalInserted}`);
    }

    // 3) Borrar fichero temporal
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Could not remove temp file:', err);
    });

    // 4) Responder
    return res.status(200).json({
      message: 'File processed successfully.',
      recordsSaved: totalInserted,
    });

  } catch (err) {
    console.error('Error processing uploaded file:', err);
    // Intentamos borrar el fichero si algo salió mal
    fs.unlink(filePath, () => {});
    return res.status(500).json({
      error: 'Error processing the uploaded file.',
      details: err.message,
    });
  }
};

const list = async (_, res) => {
  try {
    const data = await Records
      .find({})
      .sort({ _id: -1 })       // Más recientes primero
      .limit(10)
      .lean();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching records:', err);
    return res.status(500).json({ error: 'Error fetching records.' });
  }
};

export { upload, list };
