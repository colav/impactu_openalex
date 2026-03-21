"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { institutionsApi, ListResponse, Institution, resolveOpenAlexRoute } from "@/lib/api";
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Link from "next/link";
import LoadingError from "@/components/LoadingError";
import PaginationControls from "@/components/PaginationControls";

function InstitutionCard({ inst }: { inst: Institution }) {
  const id = inst.id?.split("/").pop() || inst._id;
  return (
    <Card>
      <CardActionArea component={Link} href={`/institutions/${id}`}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <AccountBalanceIcon sx={{ color: "success.main", mt: 0.3, fontSize: 28 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {inst.display_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {inst.country_code} · {inst.type}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
                <Chip label={`${inst.works_count?.toLocaleString()} works`} size="small" variant="outlined" />
                <Chip label={`${inst.cited_by_count?.toLocaleString()} citas`} size="small" variant="outlined" />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function InstitutionsPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const { data, isLoading, error } = useQuery<ListResponse<Institution>>({
    queryKey: ["institutions", debouncedQ, page],
    queryFn: () => institutionsApi.list({ q: debouncedQ || undefined, page, per_page: PER_PAGE }),
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
      <Typography variant="h4" gutterBottom>Institutions</Typography>
      <Typography color="text.secondary" mb={3}>
        {data ? `${data.meta.count.toLocaleString()} instituciones` : "Cargando…"}
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nombre o ID de OpenAlex"
          placeholder="ej. Universidad de Antioquia o https://openalex.org/I1234"
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
        {data?.results.map((inst) => (
          <Grid item xs={12} sm={6} md={4} key={inst._id}>
            <InstitutionCard inst={inst} />
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
