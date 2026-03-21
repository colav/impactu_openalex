"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { worksApi, Work } from "@/lib/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import LoadingError from "@/components/LoadingError";
import OaBadge from "@/components/OaBadge";

export default function WorkDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: work, isLoading, error } = useQuery<Work>({
    queryKey: ["work", id],
    queryFn: () => worksApi.get(id),
  });

  if (isLoading || error) return <LoadingError loading={isLoading} error={error} />;
  if (!work) return null;

  const landingUrl = work.primary_location?.landing_page_url;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <Chip label={work.type} variant="outlined" size="small" />
          {work.open_access && (
            <OaBadge isOa={work.open_access.is_oa} status={work.open_access.oa_status} />
          )}
          {work.language && <Chip label={work.language.toUpperCase()} size="small" />}
        </Box>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          {work.title || work.display_name}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {work.publication_date} · {work.cited_by_count ?? 0} citas
          {work.biblio?.volume && ` · Vol. ${work.biblio.volume}`}
          {work.biblio?.first_page && `, pp. ${work.biblio.first_page}–${work.biblio.last_page}`}
        </Typography>
        {landingUrl && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNewIcon />}
            href={landingUrl}
            target="_blank"
            rel="noreferrer"
            sx={{ mt: 1 }}
          >
            Ver artículo
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Abstract */}
          {work.abstract && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Resumen</Typography>
              <Typography variant="body2" color="text.secondary">
                {work.abstract}
              </Typography>
            </Paper>
          )}

          {/* Authors */}
          {work.authorships && work.authorships.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Autores</Typography>
              <List dense>
                {work.authorships.map((a, i) => {
                  const authorId = a.author.id?.split("/").pop();
                  return (
                    <ListItem key={i} disableGutters>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          authorId ? (
                            <Link href={`/authors/${authorId}`} style={{ color: "inherit" }}>
                              {a.author.display_name}
                            </Link>
                          ) : (
                            a.author.display_name
                          )
                        }
                        secondary={a.institutions?.map((i) => i.display_name).join(", ")}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Source */}
          {work.primary_location?.source && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Fuente</Typography>
              <Typography variant="body2" fontWeight={600}>
                {work.primary_location.source.display_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {work.primary_location.source.type}
              </Typography>
            </Paper>
          )}

          {/* Topics */}
          {work.topics && work.topics.length > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Topics
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {work.topics.slice(0, 6).map((t) => (
                  <Chip key={t.display_name} label={t.display_name} size="small" />
                ))}
              </Box>
            </Paper>
          )}

          {/* Keywords */}
          {work.keywords && work.keywords.length > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Keywords
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {work.keywords.map((k) => (
                  <Chip key={k.display_name} label={k.display_name} size="small" variant="outlined" />
                ))}
              </Box>
            </Paper>
          )}

          {/* Primary Topic */}
          {work.primary_topic && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Topic principal</Typography>
              <Typography variant="body2" fontWeight={600}>{work.primary_topic.display_name}</Typography>
              {work.primary_topic.field && (
                <Typography variant="caption" color="text.secondary">
                  {work.primary_topic.field.display_name} · {work.primary_topic.domain?.display_name}
                </Typography>
              )}
            </Paper>
          )}

          {/* OpenAlex ID */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">OpenAlex ID</Typography>
            <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
              {work.id}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
