"use client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface Props {
  loading?: boolean;
  error?: unknown;
}

export default function LoadingError({ loading, error }: Props) {
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography color="error">
          Error cargando datos. Verifica que el backend esté corriendo en{" "}
          {process.env.NEXT_PUBLIC_API_URL}.
        </Typography>
      </Box>
    );
  return null;
}
