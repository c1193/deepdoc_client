import formidable from "formidable";
import fs from "fs";
import dbConnect from "../../lib/db";
import { uploadToS3 } from "../../lib/s3";
import { createFile, addEvidence } from "../../lib/fileModel";
import { analyzeText } from "../../lib/analyzer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const evidenceFields = [
  "evidence11",
  "evidence12",
  "evidence13",
  "evidence14",
  "evidence21",
  "evidence22",
  "evidence23",
  "evidence31",
  "evidence41",
  "evidence42",
  "evidence51",
  "evidence52",
];

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: ({ mimetype }) => mimetype === "application/pdf",
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function readFileBuffer(filepath) {
  return fs.promises.readFile(filepath);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { fields, files } = await parseForm(req);

    // Parse student data
    const dataField = fields.data;
    const dataString = Array.isArray(dataField) ? dataField[0] : dataField;
    const studentData = JSON.parse(dataString);

    // Process project file
    const projectFiles = files.project;
    const projectFile = Array.isArray(projectFiles)
      ? projectFiles[0]
      : projectFiles;

    if (!projectFile) {
      return res.status(400).json({ error: "Project file is required" });
    }

    const projectBuffer = await readFileBuffer(projectFile.filepath);
    const projectKey = `deepdocument-${Date.now()}`;

    // Upload project to S3
    await uploadToS3(projectKey, projectBuffer, projectFile.mimetype);
    console.log("Project uploaded to S3");

    // Create document in MongoDB
    const createdProject = await createFile({
      key: projectKey,
      filename: projectFile.originalFilename,
      mimetype: projectFile.mimetype,
      size: projectFile.size,
      result: null,
      studentData: studentData,
    });
    console.log(`Created document with ID: ${createdProject._id}`);

    // Process evidence files
    for (const fieldName of evidenceFields) {
      const evidenceFiles = files[fieldName];
      if (!evidenceFiles) continue;

      const filesArray = Array.isArray(evidenceFiles)
        ? evidenceFiles
        : [evidenceFiles];

      for (const file of filesArray) {
        const buffer = await readFileBuffer(file.filepath);
        const key = `deepdocument-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        await uploadToS3(key, buffer, file.mimetype);

        await addEvidence(createdProject._id, {
          key: key,
          filename: file.originalFilename,
          mimetype: file.mimetype,
          size: file.size,
          fileGroup: fieldName,
          uploadedAt: new Date(),
        });
        console.log(`Uploaded evidence: ${file.originalFilename}`);
      }
    }

    // Trigger AI analysis in background (don't await)
    analyzeText(projectBuffer, projectFile.originalFilename, createdProject._id)
      .then(() => console.log("AI analysis completed"))
      .catch((err) => console.error("AI analysis failed:", err));

    return res.status(201).json({ status: 201, message: "Upload successful" });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(400).json({ status: 400, error: error.message });
  }
}
