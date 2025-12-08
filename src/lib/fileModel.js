import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  key: { type: String, required: true },
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now, required: true },
  evidence: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
    required: true,
  },
  result: { type: mongoose.Schema.Types.Mixed, required: false },
  studentData: { type: mongoose.Schema.Types.Mixed, required: true },
  url: { type: String, required: false },
});

const FileModel = mongoose.models.File || mongoose.model("File", FileSchema);

export async function createFile(data) {
  return await FileModel.create(data);
}

export async function findFileById(id) {
  return await FileModel.findById(id);
}

export async function findFilesByYear(year) {
  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  return await FileModel.find({
    uploadedAt: {
      $gte: startDate,
      $lte: endDate,
    },
    "result.first_score": { $exists: true },
  }).sort({ "result.overall_score": -1 });
}

export async function updateFileResult(id, result) {
  return await FileModel.findByIdAndUpdate(id, { result }, { new: true });
}

export async function addEvidence(id, evidenceData) {
  return await FileModel.findByIdAndUpdate(
    id,
    { $push: { evidence: evidenceData } },
    { new: true }
  );
}

export default FileModel;
