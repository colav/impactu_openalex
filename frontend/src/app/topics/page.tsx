"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { topicsApi, ListResponse, Topic } from "@/lib/api";
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
import Link from "next/link";
import LoadingError from "@/components/LoadingError";
import PaginationControls from "@/components/PaginationControls";

function TopicCard({ topic }: { topic: Topic }) {
  const id = topic.id?.split("/").pop() || topic._id;
  return (
    <Card>
      <CardActionArea component={Link} href={`/topics/${id}`}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>{topic.display_name}</Typography>
          {topic.field && (
            <Typography variant="caption" color="text.secondary">
              {topic.domain?.display_name} › {topic.field?.display_name} › {topic.subfield?.display_name}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            {topic.works_count !== undefined && (
              <Chip label={`${topic.works_count?.toLocaleString()} works`} size="small" variant="outlined" />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function TopicsPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const { data, isLoading, error } = useQuery<ListResponse<Topic>>({
    queryKey: ["topics", debouncedQ, page],
    queryFn: () => topicsApi.list({ q: debouncedQ || undefined, page, per_page: PER_PAGE }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQ(q);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Topics</Typography>
      <Typography color="text.secondary" mb={3}>
        {data ? `${data.meta.count.toLocaleString()} tópicos` : "Cargando…"}
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Buscar tópico"
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
        {data?.results.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t._id}>
            <TopicCard topic={t} />
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
