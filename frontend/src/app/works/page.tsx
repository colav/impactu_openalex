"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { worksApi, ListResponse, Work } from "@/lib/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import Link from "next/link";
import LoadingError from "@/components/LoadingError";
import PaginationControls from "@/components/PaginationControls";
import OaBadge from "@/components/OaBadge";

const WORK_TYPES = ["article", "book-chapter", "book", "dissertation", "dataset", "review", "preprint", "other"];

function WorkCard({ work }: { work: Work }) {
  const openAlexId = work.id?.split("/").pop() || work._id;
  return (
    <Card>
      <CardActionArea component={Link} href={`/works/${openAlexId}`}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom lineHeight={1.35}>
            {work.title || work.display_name}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
            <Chip label={work.type} size="small" variant="outlined" />
            {work.open_access && (
              <OaBadge isOa={work.open_access.is_oa} status={work.open_access.oa_status} />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2, color: "text.secondary", fontSize: 13 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarMonthIcon fontSize="inherit" />
              {work.publication_year}
            </Box>
            {work.cited_by_count !== undefined && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FormatQuoteIcon fontSize="inherit" />
                {work.cited_by_count} citas
              </Box>
            )}
          </Box>
          {work.primary_location?.source && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {work.primary_location.source.display_name}
            </Typography>
          )}
          {work.authorships && work.authorships.length > 0 && (
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {work.authorships
                .slice(0, 3)
                .map((a) => a.author.display_name)
                .join(", ")}
              {work.authorships.length > 3 && ` +${work.authorships.length - 3}`}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function WorksPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const PER_PAGE = 12;

  const { data, isLoading, error } = useQuery<ListResponse<Work>>({
    queryKey: ["works", debouncedQ, page, type],
    queryFn: () =>
      worksApi.list({
        q: debouncedQ || undefined,
        page,
        per_page: PER_PAGE,
        type: type || undefined,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQ(q);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Works
      </Typography>
      <Typography color="text.secondary" mb={3}>
        {data ? `${data.meta.count.toLocaleString()} resultados` : "Cargando…"}
      </Typography>

      {/* Filters */}
      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Buscar por título"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 240 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Tipo</InputLabel>
          <Select value={type} label="Tipo" onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <MenuItem value="">Todos</MenuItem>
            {WORK_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <button type="submit" style={{ display: "none" }} />
      </Box>

      <Divider sx={{ mb: 3 }} />

      <LoadingError loading={isLoading} error={error} />

      <Grid container spacing={2}>
        {data?.results.map((w) => (
          <Grid item xs={12} sm={6} md={4} key={w._id}>
            <WorkCard work={w} />
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
