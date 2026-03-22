"use client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDb } from "@/context/DbContext";
import axios from "axios";

interface Props {
  loading?: boolean;
  error?: unknown;
}

export default function LoadingError({ loading, error }: Props) {
  const { currentDb, defaultDb, databases, setCurrentDb } = useDb();
  const activeDb = currentDb || defaultDb;

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (error) {
    const is404 = axios.isAxiosError(error) && error.response?.status === 404;
    const otherDb = databases.find((d) => d.key !== activeDb);

    if (is404 && otherDb) {
      return (
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography color="text.secondary" gutterBottom>
            Este registro no existe en <strong>{databases.find((d) => d.key === activeDb)?.name ?? activeDb}</strong>.
          </Typography>
          <Button variant="outlined" onClick={() => setCurrentDb(otherDb.key)}>
            Buscar en {otherDb.name}
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography color="error">
          Error cargando datos. Verifica que el backend esté corriendo en{" "}
          {process.env.NEXT_PUBLIC_API_URL}.
        </Typography>
      </Box>
    );
  }
  return null;
}
