"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { conceptsApi, ListResponse, Concept } from "@/lib/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Link from "next/link";
import LoadingError from "@/components/LoadingError";
import PaginationControls from "@/components/PaginationControls";

const LEVEL_COLORS: Record<number, string> = {
  0: "#7b1fa2",
  1: "#5c35d4",
  2: "#1976d2",
  3: "#0288d1",
  4: "#00897b",
};

function ConceptCard({ concept }: { concept: Concept }) {
  const id = concept.id?.split("/").pop() || concept._id;
  const color = LEVEL_COLORS[concept.level] || "#888";
  return (
    <Card>
      <CardActionArea component={Link} href={`/concepts/${id}`}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
            <BubbleChartIcon sx={{ color, fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={600}>{concept.display_name}</Typography>
          </Box>
          <Chip label={`Nivel ${concept.level}`} size="small" sx={{ bgcolor: color, color: "white", mr: 0.5 }} />
          <Chip label={`${concept.works_count?.toLocaleString()} works`} size="small" variant="outlined" />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function ConceptsPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const { data, isLoading, error } = useQuery<ListResponse<Concept>>({
    queryKey: ["concepts", debouncedQ, page],
    queryFn: () => conceptsApi.list({ q: debouncedQ || undefined, page, per_page: PER_PAGE }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQ(q);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Concepts</Typography>
      <Typography color="text.secondary" mb={3}>
        {data ? `${data.meta.count.toLocaleString()} conceptos` : "Cargando…"}
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Buscar concepto"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <button type="submit" style={{ display: "none" }} />
      </Box>

      <Divider sx={{ mb: 3 }} />
      <LoadingError loading={isLoading} error={error} />

      <Grid container spacing={2}>
        {data?.results.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c._id}>
            <ConceptCard concept={c} />
          </Grid>
        ))}
      </Grid>

      {data && (
        <PaginationControls
          count={data.meta.count}
          page={page}
          perPage={PER_PAGE}
          onChange={(p) => setPage(p)}
        />
      )}
    </Container>
  );
}
