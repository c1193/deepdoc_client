import dbConnect from "../../lib/db";
import { findFilesByYear } from "../../lib/fileModel";
import { getSignedUrl } from "../../lib/s3";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    const rawDatas = await findFilesByYear(year);
    const returnData = [];

    for (const project of rawDatas) {
      const projectObj = project.toObject();

      // Get signed URL for project file
      const signedUrl = await getSignedUrl(projectObj.key);
      projectObj.url = signedUrl;

      // Get signed URLs for evidence files
      if (projectObj.evidence && projectObj.evidence.length > 0) {
        for (const evidence of projectObj.evidence) {
          const evidenceUrl = await getSignedUrl(evidence.key);
          evidence.url = evidenceUrl;
        }
      } else {
        projectObj.evidence = [];
      }

      returnData.push(projectObj);
    }

    return res.status(200).json(returnData);
  } catch (error) {
    console.error("Resultlist error:", error);
    return res.status(500).json({ error: error.message });
  }
}
