"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import axios from "axios";

export default function PDFAnalyzer() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setResult({});
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:8000"}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      setResult(data);
    } catch (error) {
      console.error("Axios error:", error);
      alert(error?.response?.data?.message || "Failed to analyze.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ mx: "auto", mt: 4, p: 2 }}>
        <Typography variant="h2" gutterBottom>
          PDF Project Analyzer
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button variant="outlined" component="label">
            Upload PDFs
            <input
              type="file"
              hidden
              accept=".pdf"
              multiple
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="body1">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "No files selected"}
          </Typography>
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={files.length === 0 || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Analyze"}
          </Button>
        </Stack>
        {result.file_name ? (
          <>
            <Box>
              <Typography variant="h4" gutterBottom>
                Project Summary
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {result.project_summary}
              </Typography>
            </Box>
          </>
        ) : null}
        {result.file_name ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Analysis Results: {result.file_name}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">First Dimension</TableCell>
                    <TableCell align="center">{result.first_score}</TableCell>
                    <TableCell align="left">{result.first_reson}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Second Dimension</TableCell>
                    <TableCell align="center">{result.second_score}</TableCell>
                    <TableCell align="left">{result.second_reson}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Third Dimension</TableCell>
                    <TableCell align="center">{result.third_score}</TableCell>
                    <TableCell align="left">{result.third_reson}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Fourth Dimension</TableCell>
                    <TableCell align="center">{result.fourth_score}</TableCell>
                    <TableCell align="left">{result.fourth_reson}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Fifth Dimension</TableCell>
                    <TableCell align="center">{result.fifth_score}</TableCell>
                    <TableCell align="left">{result.fifth_reson}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Over All</TableCell>
                    <TableCell align="center">{result.overall_score}</TableCell>
                    <TableCell align="left">{result.overall_reason}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
