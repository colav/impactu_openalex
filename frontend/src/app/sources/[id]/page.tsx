"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { sourcesApi, Source } from "@/lib/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LoadingError from "@/components/LoadingError";
import JsonViewer from "@/components/JsonViewer";
import OaBadge from "@/components/OaBadge";

function StatBox({ label, value }: { label: string; value: any }) {
  return (
    <Box sx={{ textAlign: "center", px: 2 }}>
      <Typography variant="h5" fontWeight={700}>{value ?? "—"}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

export default function SourceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: source, isLoading, error } = useQuery<Source>({
    queryKey: ["source", id],
    queryFn: () => sourcesApi.get(id),
  });

  if (isLoading || error) return <LoadingError loading={isLoading} error={error} />;
  if (!source) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <LibraryBooksIcon sx={{ fontSize: 52, color: "warning.main" }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>{source.display_name}</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
            <Chip label={source.type} variant="outlined" size="small" />
            {source.issn_l && <Chip label={`ISSN: ${source.issn_l}`} size="small" />}
            <OaBadge isOa={source.is_oa} />
            {source.is_in_doaj && <Chip label="DOAJ" color="info" size="small" />}
          </Box>
          {source.host_organization_name && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {source.host_organization_name}
            </Typography>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <StatBox label="Works" value={source.works_count?.toLocaleString()} />
          <StatBox label="Citas" value={source.cited_by_count?.toLocaleString()} />
          {source.summary_stats && (
            <>
              <StatBox label="h-index" value={source.summary_stats.h_index} />
              <StatBox
                label="Citedness (2yr)"
                value={source.summary_stats["2yr_mean_citedness"]?.toFixed(2)}
              />
            </>
          )}
          {source.apc_usd && (
            <StatBox label="APC (USD)" value={`$${source.apc_usd.toLocaleString()}`} />
          )}
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {source.country_code && (
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">País</Typography>
              <Typography>{source.country_code}</Typography>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">OpenAlex ID</Typography>
            <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
              {source.id}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <JsonViewer data={source} />
      </Box>
    </Container>
  );
}
