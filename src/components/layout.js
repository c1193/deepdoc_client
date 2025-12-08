import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: 9999 }}>
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h4" sx={{ mr: 2 }}>
            DeepDoc
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mr: 2, cursor: "pointer" }}
            onClick={() => router.push("/submit")}
          >
            Submit
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mr: 2, cursor: "pointer" }}
            onClick={() => router.push("/results")}
          >
            Results
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      <main
        style={{ marginTop: "64px", marginBottom: "48px", overflow: "auto" }}
      >
        {children}
      </main>

      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#eee",
          padding: "16px",
          textAlign: "center",
          zIndex: 9999,
        }}
      >
        <p style={{ margin: 0 }}>© 2025 DeepDoc</p>
      </footer>
    </>
  );
}
