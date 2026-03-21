"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { topicsApi, Topic } from "@/lib/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import LoadingError from "@/components/LoadingError";

export default function TopicDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: topic, isLoading, error } = useQuery<Topic>({
    queryKey: ["topic", id],
    queryFn: () => topicsApi.get(id),
  });

  if (isLoading || error) return <LoadingError loading={isLoading} error={error} />;
  if (!topic) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {topic.display_name}
      </Typography>

      {topic.domain && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <Chip label={topic.domain.display_name} color="primary" size="small" />
          {topic.field && <Chip label={topic.field.display_name} color="secondary" size="small" />}
          {topic.subfield && <Chip label={topic.subfield.display_name} size="small" />}
        </Box>
      )}

      {topic.description && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Descripción</Typography>
          <Typography color="text.secondary">{topic.description}</Typography>
        </Paper>
      )}

      {topic.keywords && topic.keywords.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Keywords</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {topic.keywords.map((k) => (
              <Chip key={k} label={k} size="small" variant="outlined" />
            ))}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">OpenAlex ID</Typography>
        <Typography variant="caption">{topic.id}</Typography>
      </Paper>
    </Container>
  );
}
