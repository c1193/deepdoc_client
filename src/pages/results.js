"use client";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Result() {
  const [year, setYear] = useState("");
  const [data, setData] = useState(undefined);
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(currentYear - 1950 + 1),
    (val, index) => currentYear - index
  );
  const [targetData, setTargetData] = useState(null);

  const handleChange = async (event) => {
    setYear(event.target.value);
    const res = await axios.get("/api/resultlist", {
      params: { year: event.target.value },
    });
    if (res.data) {
      console.log(res.data);
      setData(res.data);
    }
  };

  const openPopUp = async (dto) => {
    setTargetData(dto);
  };

  return (
    <>
      <Dialog
        open={targetData !== null}
        onClose={() => setTargetData(null)}
        maxWidth="lg"
        fullWidth
        sx={{ mt: 5, mb: 4 }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5">{targetData?.studentData.name}</Typography>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Typography variant="h6" gutterBottom>
            สรุปข้อมูลโครงการ
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Markdown remarkPlugins={[remarkGfm]}>
              {targetData?.result?.project_summary || "ไม่มีข้อมูล"}
            </Markdown>
          </Box>
          <Typography variant="h6" gutterBottom>
            ผลการประเมิน
          </Typography>
          <Typography variant="body1" gutterBottom>
            คะแนนตัวชี้วัดที่ 1 : {targetData?.result?.first_score}/20
          </Typography>
          <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
            {targetData?.result?.first_reason}
          </Typography>
          <Typography variant="body1" gutterBottom>
            คะแนนตัวชี้วัดที่ 2 : {targetData?.result?.second_score}/30
          </Typography>
          <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
            {targetData?.result?.second_reason}
          </Typography>
          <Typography variant="body1" gutterBottom>
            คะแนนตัวชี้วัดที่ 3 : {targetData?.result?.third_score}/25
          </Typography>
          <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
            {targetData?.result?.third_reason}
          </Typography>
          <Typography variant="body1" gutterBottom>
            คะแนนตัวชี้วัดที่ 4 : {targetData?.result?.fourth_score}/15
          </Typography>
          <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
            {targetData?.result?.fourth_reason}
          </Typography>
          <Typography variant="body1" gutterBottom>
            คะแนนตัวชี้วัดที่ 5 : {targetData?.result?.fifth_score}/10
          </Typography>
          <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
            {targetData?.result?.fifth_reason}
          </Typography>
          <Typography variant="body1" gutterBottom>
            คะแนนรวม : {targetData?.result?.overall_score}/100
          </Typography>
          <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
            {targetData?.result?.overall_reason}
          </Typography>

          <Typography variant="h6" gutterBottom>
            ไฟล์ที่เกี่ยวข้อง
          </Typography>
          <a href={targetData?.url} target="_blank" rel="noopener noreferrer">
            ไฟล์โครงการ
          </a>
          {targetData?.evidence.map((evidence) => (
            <Typography key={evidence.key} variant="body2" gutterBottom>
              <a href={evidence?.url} target="_blank" rel="noopener noreferrer">
                {evidence?.filename}
              </a>
            </Typography>
          ))}
        </DialogContent>
      </Dialog>

      <Box sx={{ maxWidth: "90%", mx: "auto", p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ผลลัพธ์
        </Typography>
        <InputLabel id="year-label">ปี</InputLabel>
        <Select
          labelId="year-label"
          value={year}
          label="Year"
          onChange={handleChange}
          sx={{ mb: 2, minWidth: 120 }}
        >
          {years.map((yearOption) => (
            <MenuItem key={yearOption} value={yearOption}>
              {yearOption}
            </MenuItem>
          ))}
        </Select>
        {data && (
          <TableContainer component={Paper}>
            <Table>
              {data.length != 0 ? (
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อ</TableCell>
                    <TableCell align="center">ตัวชี้วัดที่ 1</TableCell>
                    <TableCell align="center">ตัวชี้วัดที่ 2</TableCell>
                    <TableCell align="center">ตัวชี้วัดที่ 3</TableCell>
                    <TableCell align="center">ตัวชี้วัดที่ 4</TableCell>
                    <TableCell align="center">ตัวชี้วัดที่ 5</TableCell>
                    <TableCell align="center">คะแนนรวม</TableCell>
                  </TableRow>
                </TableHead>
              ) : null}

              <TableBody>
                {data.map((dto) => (
                  <TableRow key={dto.uploadedAt}>
                    <TableCell
                      onClick={() => openPopUp(dto)}
                      align="left"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "primary.main",
                        },
                      }}
                    >
                      {dto.studentData.name}
                    </TableCell>
                    <TableCell align="center">
                      {dto.result.first_score}
                    </TableCell>
                    <TableCell align="center">
                      {dto.result.second_score}
                    </TableCell>
                    <TableCell align="center">
                      {dto.result.third_score}
                    </TableCell>
                    <TableCell align="center">
                      {dto.result.fourth_score}
                    </TableCell>
                    <TableCell align="center">
                      {dto.result.fifth_score}
                    </TableCell>
                    <TableCell align="center">
                      {dto.result.overall_score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
