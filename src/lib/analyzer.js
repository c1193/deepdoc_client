import { GoogleGenerativeAI } from "@google/generative-ai";
import { first, second, third, fourth, fifth } from "./scoring";
import { updateFileResult } from "./fileModel";

export async function analyzeText(fileBuffer, fileName, fileId) {
  try {
    console.log("Analyzing...");
    // pdf-parse v1.1.1 - default export is the parse function
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(fileBuffer);
    const genAI = new GoogleGenerativeAI(process.env.APIKEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `คุณคือผู้เชี่ยวชาญในการประเมินผลงาน ให้คะแนนโครงการที่ได้รับ
              โดยให้คะแนนเต็ม 100 คะแนน โดยใช้เกณฑ์ 5 ข้อต่อไปนี้ 
              ${first}
              ${second}
              ${third}
              ${fourth}
              ${fifth}
              โปรดตอบกลับ **เฉพาะในรูปแบบ JSON**
              โดยแต่ละอ็อบเจ็กต์ต้องมีฟิลด์ดังนี้
              - file_name: ชื่อของไฟล์
              - first_score: คะแนนสำหรับมิติที่ 1
              - first_reason: เหตุผลในการให้คะแนนสำหรับมิติที่ 1
              - second_score: คะแนนสำหรับมิติที่ 2
              - second_reason: เหตุผลในการให้คะแนนสำหรับมิติที่ 2
              - third_score: คะแนนสำหรับมิติที่ 3
              - third_reason: เหตุผลในการให้คะแนนสำหรับมิติที่ 3
              - fourth_score: คะแนนสำหรับมิติที่ 4
              - fourth_reason: เหตุผลในการให้คะแนนสำหรับมิติที่ 4
              - fifth_score: คะแนนสำหรับมิติที่ 5
              - fifth_reason: เหตุผลในการให้คะแนนสำหรับมิติที่ 5
              - overall_score คะแนนรวม เต็ม 100 (จำนวนเต็ม)
              - overall_reason: สรุปการให้คะแนนสั้นๆ ประมาณ 1-2 บรรทัด
              - project_summary: บทอธิบายสรุปภาพรวมของโครงการ ประมาณ 1 หน้า ในรูปแบบ Markdown

              ตัวอย่างผลลัพธ์ที่ต้องการ:
              {
                file_name: "โครงการส่งเสริมการอ่านในโรงเรียนชนบท.pdf",
                first_score: 18,
                first_reason: "โครงการมีการแต่งตั้งและสื่อสารความรับผิดชอบด้านการบริหารความเสี่ยง แต่ขาดการฝึกอบรมด้านการบริหารความเสี่ยง"
                second_score: 15,
                second_reason: "โครงการมีแผนบริหารความเสี่ยงของส่วนงาน/หน่วยงาน แต่ขาดการถ่ายทอดแผนบริหารความเสี่ยงไปยังส่วนงาน/หน่วยงานย่อยหรือผู้รับผิดชอบ"
                third_score: 20,
                third_reason: "โครงการมีการรายงานผลการบริหารความเสี่ยง แต่ไม่มีการติดตามความเสี่ยงอย่างสม่ำเสมอ"
                fourth_score: 17,
                fourth_reason: "โครงการมีกิจกรรมสร้างความตระหนักด้านความเสี่ยง แต่ขาดการยกย่องความพยายามด้านการบริหารความเสี่ยง"
                fifth_score: 19,
                fifth_reason: "โครงการมีบทเรียนที่ได้รับและแนวปฏิบัติที่ดี แต่ไม่มีการปรับปรุงกระบวนการบริหารความเสี่ยง"
                overall_score: 89,
                overall_reason: "โครงการมีความชัดเจน ครอบคลุม และมีการดำเนินงานที่เป็นรูปธรรม เหมาะสมกับกลุ่มเป้าหมาย"
                project_summary: "**บทสรุปอธิบายภาพรวมของโครงการ ประมาณ 1 หน้า**"
              }`,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: ` ชื่อไฟล์: ${fileName}\n${data.text}\n==============================`,
          },
        ],
      },
    ];

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 1,
      },
    });

    const textData = result.response.text();
    const match = textData.match(/\{[\s\S]*\}/);

    if (match) {
      const jsonString = match[0];
      const resultData = JSON.parse(jsonString);
      await updateFileResult(fileId, resultData);
      console.log("Result updated.");
      return resultData;
    } else {
      throw new Error("Match not found");
    }
  } catch (error) {
    console.error("Analyze error:", error);
    throw error;
  }
}
