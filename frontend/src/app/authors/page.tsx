"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authorsApi, ListResponse, Author, resolveOpenAlexRoute } from "@/lib/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import LoadingError from "@/components/LoadingError";
import PaginationControls from "@/components/PaginationControls";

function AuthorCard({ author }: { author: Author }) {
  const id = author.id?.split("/").pop() || author._id;
  const initials = author.display_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardActionArea component={Link} href={`/authors/${id}`}>
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar sx={{ bgcolor: "secondary.main", width: 48, height: 48, fontSize: 18 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {author.display_name}
            </Typography>
            {author.last_known_institutions && author.last_known_institutions[0] && (
              <Typography variant="caption" color="text.secondary">
                {author.last_known_institutions[0].display_name}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
              <Chip label={`${author.works_count} works`} size="small" variant="outlined" />
              <Chip label={`${author.cited_by_count} citas`} size="small" variant="outlined" />
              {author.summary_stats && (
                <Chip label={`h=${author.summary_stats.h_index}`} size="small" />
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function AuthorsPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const { data, isLoading, error } = useQuery<ListResponse<Author>>({
    queryKey: ["authors", debouncedQ, page],
    queryFn: () => authorsApi.list({ q: debouncedQ || undefined, page, per_page: PER_PAGE }),
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
      <Typography variant="h4" gutterBottom>Authors</Typography>
      <Typography color="text.secondary" mb={3}>
        {data ? `${data.meta.count.toLocaleString()} autores` : "Cargando…"}
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nombre o ID de OpenAlex"
          placeholder="ej. García o https://openalex.org/A1234"
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
        {data?.results.map((a) => (
          <Grid item xs={12} sm={6} md={4} key={a._id}>
            <AuthorCard author={a} />
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
