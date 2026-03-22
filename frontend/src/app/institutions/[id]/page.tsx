"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { institutionsApi, Institution } from "@/lib/api";
import { useDb } from "@/context/DbContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LoadingError from "@/components/LoadingError";
import JsonViewer from "@/components/JsonViewer";

function StatBox({ label, value }: { label: string; value: any }) {
  return (
    <Box sx={{ textAlign: "center", px: 2 }}>
      <Typography variant="h5" fontWeight={700}>{value ?? "—"}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

export default function InstitutionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { currentDb, defaultDb } = useDb();
  const activeDb = currentDb || defaultDb || undefined;

  const { data: inst, isLoading, error } = useQuery<Institution>({
    queryKey: ["institution", id, activeDb],
    queryFn: () => institutionsApi.get(id, activeDb),
  });

  if (isLoading || error) return <LoadingError loading={isLoading} error={error} />;
  if (!inst) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <AccountBalanceIcon sx={{ fontSize: 56, color: "success.main" }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>{inst.display_name}</Typography>
          <Typography color="text.secondary">
            {inst.country_code} · {inst.type}
          </Typography>
          {inst.homepage_url && (
            <Button
              size="small"
              startIcon={<OpenInNewIcon />}
              href={inst.homepage_url}
              target="_blank"
              rel="noreferrer"
              sx={{ mt: 0.5, pl: 0 }}
            >
              Sitio web
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <StatBox label="Works" value={inst.works_count?.toLocaleString()} />
          <StatBox label="Citas" value={inst.cited_by_count?.toLocaleString()} />
          {inst.summary_stats && (
            <>
              <StatBox label="h-index" value={inst.summary_stats.h_index} />
              <StatBox label="i10-index" value={inst.summary_stats.i10_index} />
            </>
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Geo */}
        {inst.geo && (inst.geo.city || inst.geo.country) && (
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
              <Typography>{inst.geo.city}{inst.geo.city && inst.geo.country ? ", " : ""}{inst.geo.country}</Typography>
              {inst.geo.latitude && (
                <Typography variant="caption" color="text.secondary">
                  {inst.geo.latitude?.toFixed(4)}, {inst.geo.longitude?.toFixed(4)}
                </Typography>
              )}
            </Paper>
          </Grid>
        )}

        {/* ROR */}
        {inst.ror && (
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">ROR</Typography>
              <Typography variant="body2">
                <a href={inst.ror} target="_blank" rel="noreferrer">{inst.ror}</a>
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Topics */}
        {inst.topics && inst.topics.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Topics principales</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {inst.topics.slice(0, 20).map((t: any) => (
                  <Chip key={t.display_name} label={t.display_name} size="small" />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">OpenAlex: {inst.id}</Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <JsonViewer data={inst} />
      </Box>
    </Container>
  );
}
