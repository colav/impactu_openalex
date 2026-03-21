"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { sourcesApi, ListResponse, Source, resolveOpenAlexRoute } from "@/lib/api";
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
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Link from "next/link";
import LoadingError from "@/components/LoadingError";
import PaginationControls from "@/components/PaginationControls";
import OaBadge from "@/components/OaBadge";

function SourceCard({ source }: { source: Source }) {
  const id = source.id?.split("/").pop() || source._id;
  return (
    <Card>
      <CardActionArea component={Link} href={`/sources/${id}`}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <LibraryBooksIcon sx={{ color: "warning.main", mt: 0.3, fontSize: 28 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {source.display_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {source.type}{source.issn_l ? ` · ISSN: ${source.issn_l}` : ""}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
                <OaBadge isOa={source.is_oa} />
                <Chip label={`${source.works_count?.toLocaleString()} works`} size="small" variant="outlined" />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function SourcesPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const { data, isLoading, error } = useQuery<ListResponse<Source>>({
    queryKey: ["sources", debouncedQ, page],
    queryFn: () => sourcesApi.list({ q: debouncedQ || undefined, page, per_page: PER_PAGE }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const route = resolveOpenAlexRoute(q);
    if (route) { router.push(route); return; }
    setDebouncedQ(q);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Sources</Typography>
      <Typography color="text.secondary" mb={3}>
        {data ? `${data.meta.count.toLocaleString()} fuentes` : "Cargando…"}
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nombre o ID de OpenAlex"
          placeholder="ej. Nature o https://openalex.org/S1234"
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
        {data?.results.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s._id}>
            <SourceCard source={s} />
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
