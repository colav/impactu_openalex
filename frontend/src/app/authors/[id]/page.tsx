"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authorsApi, Author } from "@/lib/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
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

export default function AuthorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: author, isLoading, error } = useQuery<Author>({
    queryKey: ["author", id],
    queryFn: () => authorsApi.get(id),
  });

  if (isLoading || error) return <LoadingError loading={isLoading} error={error} />;
  if (!author) return null;

  const initials = author.display_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "secondary.main", width: 72, height: 72, fontSize: 28 }}>
          {initials}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700}>{author.display_name}</Typography>
          {author.last_known_institutions?.[0] && (
            <Typography color="text.secondary">
              {author.last_known_institutions[0].display_name} ·{" "}
              {author.last_known_institutions[0].country_code}
            </Typography>
          )}
          {author.ids?.orcid && (
            <Typography variant="caption">
              ORCID:{" "}
              <a href={author.ids.orcid} target="_blank" rel="noreferrer">
                {author.ids.orcid.replace("https://orcid.org/", "")}
              </a>
            </Typography>
          )}
        </Box>
      </Box>

      {/* Stats */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <StatBox label="Works" value={author.works_count?.toLocaleString()} />
          <StatBox label="Citas" value={author.cited_by_count?.toLocaleString()} />
          <StatBox label="h-index" value={author.summary_stats?.h_index} />
          <StatBox label="i10-index" value={author.summary_stats?.i10_index} />
          <StatBox
            label="Citedness (2yr)"
            value={author.summary_stats?.["2yr_mean_citedness"]?.toFixed(2)}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Affiliations */}
        {author.affiliations && author.affiliations.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Afiliaciones</Typography>
              {author.affiliations.slice(0, 8).map((a, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {a.institution.display_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {a.institution.country_code}
                  </Typography>
                  {i < author.affiliations!.length - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Paper>
          </Grid>
        )}

        {/* Topics */}
        {author.topics && author.topics.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Topics principales</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {author.topics.slice(0, 15).map((t: any) => (
                  <Chip key={t.display_name} label={`${t.display_name}${t.count ? ` (${t.count})` : ""}`} size="small" />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Concepts */}
        {author.x_concepts && author.x_concepts.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Conceptos</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {author.x_concepts
                  .filter((c) => c.level <= 1)
                  .slice(0, 12)
                  .map((c) => (
                    <Chip
                      key={c.display_name}
                      label={`${c.display_name} ${(c.score * 100).toFixed(0)}%`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          OpenAlex: {author.id}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <JsonViewer data={author} />
      </Box>
    </Container>
  );
}
