import { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setSession } from "../sessionSlice";

export default function Login() {
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("deepdocadmin");
  const [password, setPassword] = useState("@deepdoc2025");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_BACKENDURL || "http://localhost:8000"
        }/login`,
        {
          username,
          password,
        }
      );
      if (response) {
        dispatch(
          setSession({
            access_token: response.data.access_token,
            refesh_token: response.data.refesh_token,
          })
        );
        setUsername("");
        setPassword("");
        console.log(response);
      } else {
        alert("invalid username or password");
      }
    } catch (error) {
      alert("invalid username or password");
    }
  };

  return (
    <Dialog
      sx={{ minWidth: 300 }}
      open={session.access_token == null}
      onKeyDown={(e) =>
        e.key === "Enter" && username && password && handleLogin()
      }
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={username == "" || password == ""}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
