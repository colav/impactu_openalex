"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { conceptsApi, Concept } from "@/lib/api";
import { useDb } from "@/context/DbContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
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

export default function ConceptDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { currentDb, defaultDb } = useDb();
  const activeDb = currentDb || defaultDb || undefined;

  const { data: concept, isLoading, error } = useQuery<Concept>({
    queryKey: ["concept", id, activeDb],
    queryFn: () => conceptsApi.get(id, activeDb),
  });

  if (isLoading || error) return <LoadingError loading={isLoading} error={error} />;
  if (!concept) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <BubbleChartIcon sx={{ fontSize: 52, color: "secondary.main" }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>{concept.display_name}</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Chip label={`Nivel ${concept.level}`} size="small" color="secondary" />
          </Box>
          {concept.wikidata && (
            <Button
              size="small"
              startIcon={<OpenInNewIcon />}
              href={concept.wikidata}
              target="_blank"
              rel="noreferrer"
              sx={{ mt: 0.5, pl: 0 }}
            >
              Wikidata
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <StatBox label="Works" value={concept.works_count?.toLocaleString()} />
          <StatBox label="Citas" value={concept.cited_by_count?.toLocaleString()} />
        </Box>
      </Paper>

      {concept.description && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Descripción</Typography>
          <Typography color="text.secondary">{concept.description}</Typography>
        </Paper>
      )}

      {concept.ancestors && concept.ancestors.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Ancestros</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {concept.ancestors.map((a) => (
              <Chip key={a.display_name} label={`${a.display_name} (L${a.level})`} size="small" variant="outlined" />
            ))}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">OpenAlex ID</Typography>
        <Typography variant="caption">{concept.id}</Typography>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <JsonViewer data={concept} />
      </Box>
    </Container>
  );
}
