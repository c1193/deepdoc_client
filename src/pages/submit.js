import { useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Stack,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
  Fade,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";

export default function ProjectSubmissionForm() {
  const [projectFile, setProjectFile] = useState(null);
  const [evidence1, setEvidence1] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null,
  });
  const [evidence2, setEvidence2] = useState({
    first: null,
    second: null,
    third: null,
  });
  const [evidence3, setEvidence3] = useState({ first: null });
  const [evidence4, setEvidence4] = useState({ first: null, second: null });

  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameRef = useRef(null);
  const deptRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const projectRef = useRef(null);

  const validate = () => {
    const newErr = {};
    if (!studentName.trim()) newErr.name = true;
    if (!department.trim()) newErr.department = true;
    if (!email.trim()) newErr.email = true;
    if (!phone.trim()) newErr.phone = true;
    if (!projectFile) newErr.project = true;
    setErrors(newErr);
    if (Object.keys(newErr).length) {
      const refMap = {
        name: nameRef,
        department: deptRef,
        email: emailRef,
        phone: phoneRef,
        project: projectRef,
      };
      const firstKey = ["name", "department", "email", "phone", "project"].find(
        (k) => newErr[k]
      );
      if (firstKey && refMap[firstKey]?.current) {
        refMap[firstKey].current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setStudentName("");
    setDepartment("");
    setEmail("");
    setPhone("");
    setProjectFile(null);
    setEvidence1({ first: null, second: null, third: null, fourth: null });
    setEvidence2({ first: null, second: null, third: null });
    setEvidence3({ first: null });
    setEvidence4({ first: null, second: null });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const appendFiles = (files, key, formData) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      formData.append(key, files[i]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setDialogOpen(true);
    setLoading(true);

    const formData = new FormData();
    appendFiles(evidence1.first, "evidence11", formData);
    appendFiles(evidence1.second, "evidence12", formData);
    appendFiles(evidence1.third, "evidence13", formData);
    appendFiles(evidence1.fourth, "evidence14", formData);
    appendFiles(evidence2.first, "evidence21", formData);
    appendFiles(evidence2.second, "evidence22", formData);
    appendFiles(evidence2.third, "evidence23", formData);
    appendFiles(evidence3.first, "evidence31", formData);
    appendFiles(evidence4.first, "evidence41", formData);
    appendFiles(evidence4.second, "evidence42", formData);
    appendFiles(projectFile, "project", formData);

    const jsonData = {
      name: studentName,
      department: department,
      email: email,
      phone: phone,
    };
    formData.append("data", JSON.stringify(jsonData));

    try {
      const res = await axios.post("/api/uploadFiles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setDialogOpen(false);
          setSuccess(false);
          resetForm();
        }, 5000);
      } else {
        setDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      setDialogOpen(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Project Submission Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField
            inputRef={nameRef}
            label="ชื่อ นามสกุล"
            required
            value={studentName}
            error={Boolean(errors.name)}
            helperText={errors.name && "กรุณากรอกชื่อ"}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <TextField
            inputRef={deptRef}
            label="คณะ หรือ สังกัด"
            required
            value={department}
            error={Boolean(errors.department)}
            helperText={errors.department && "กรุณากรอกคณะ"}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <TextField
            inputRef={emailRef}
            label="อีเมลล์"
            required
            value={email}
            error={Boolean(errors.email)}
            helperText={errors.email && "กรุณากรอกอีเมลล์"}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            inputRef={phoneRef}
            label="เบอร์โทรศัพท์"
            required
            value={phone}
            error={Boolean(errors.phone)}
            helperText={errors.phone && "กรุณากรอกเบอร์โทรศัพท์"}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>

        {/* Evidence Sections */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              การกำกับความเสี่ยงและธรรมาภิบาลองค์กร
            </Typography>
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  การสื่อสารนโยบายการบริหารความเสี่ยงแบบบูรณาการของจุฬาลงกรณ์มหาวิทยาลัย
                </Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence1({ ...evidence1, first: e.target.files })
                  }
                />
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  การแต่งตั้งและสื่อสารความรับผิดชอบด้านการบริหารความเสี่ยง
                </Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence1({ ...evidence1, second: e.target.files })
                  }
                />
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  การประชุมคณะกรรมการบริหารความเสี่ยง
                </Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence1({ ...evidence1, third: e.target.files })
                  }
                />
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  การฝึกอบรมด้านการบริหารความเสี่ยง
                </Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence1({ ...evidence1, fourth: e.target.files })
                  }
                />
              </Card>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              การประเมินความเสี่ยงและการวางแผนบริหารความเสี่ยง
            </Typography>
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  การระบุความเสี่ยงของส่วนงาน/หน่วยงานสอดคล้องกับกรอบการบริหารความเสี่ยงของมหาวิทยาลัยและมีระบบการระบุที่ชัดเจน
                </Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence2({ ...evidence2, first: e.target.files })
                  }
                />
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">แผนบริหารความเสี่ยงของส่วนงาน/หน่วยงาน</Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence2({ ...evidence2, second: e.target.files })
                  }
                />
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  การถ่ายทอดแผนบริหารความเสี่ยงไปยังส่วนงาน/หน่วยงานย่อยหรือผู้รับผิดชอบในระดับปฏิบัติอย่างไร
                </Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence2({ ...evidence2, third: e.target.files })
                  }
                />
              </Card>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              การติดตามและรายงานผลการบริหารความเสี่ยง
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1">การติดตามความเสี่ยงอย่างสม่ำเสมอ</Typography>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) =>
                  setEvidence3({ ...evidence3, first: e.target.files })
                }
              />
            </Card>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              วัฒนธรรมและความตระหนักด้านการบริหารความเสี่ยง
            </Typography>
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">กิจกรรมสร้างความตระหนักด้านความเสี่ยง</Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence4({ ...evidence4, first: e.target.files })
                  }
                />
              </Card>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">การมีส่วนร่วมของบุคลากรในการบริหารความเสี่ยง</Typography>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setEvidence4({ ...evidence4, second: e.target.files })
                  }
                />
              </Card>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Project Summary (PDF)
            </Typography>
            <input
              ref={projectRef}
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setProjectFile(e.target.files)}
            />
            {errors.project && (
              <Typography color="error" variant="body2">
                กรุณาอัปโหลดไฟล์สรุปโครงการ
              </Typography>
            )}
          </CardContent>
        </Card>

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Box>

      <Dialog open={dialogOpen} PaperProps={{ sx: { textAlign: "center", p: 4 } }}>
        <DialogContent>
          {loading && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <CircularProgress size={80} />
              <Typography>Uploading, please do not close this page...</Typography>
            </Box>
          )}
          {success && (
            <Fade in={success}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80 }} />
                <Typography>Upload complete</Typography>
              </Box>
            </Fade>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
