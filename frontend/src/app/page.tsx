"use client";
import { useQuery } from "@tanstack/react-query";
import { statsApi, Stats } from "@/lib/api";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Skeleton from "@mui/material/Skeleton";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TopicIcon from "@mui/icons-material/Topic";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Link from "next/link";

const STAT_CARDS = [
  { key: "works", label: "Works", icon: <ArticleIcon sx={{ fontSize: 40 }} />, href: "/works", color: "#1976d2" },
  { key: "authors", label: "Authors", icon: <PeopleIcon sx={{ fontSize: 40 }} />, href: "/authors", color: "#5c35d4" },
  { key: "institutions", label: "Institutions", icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />, href: "/institutions", color: "#388e3c" },
  { key: "sources", label: "Sources", icon: <LibraryBooksIcon sx={{ fontSize: 40 }} />, href: "/sources", color: "#f57c00" },
  { key: "topics", label: "Topics", icon: <TopicIcon sx={{ fontSize: 40 }} />, href: "/topics", color: "#0288d1" },
  { key: "concepts", label: "Concepts", icon: <BubbleChartIcon sx={{ fontSize: 40 }} />, href: "/concepts", color: "#7b1fa2" },
];

function StatCard({ label, icon, href, color, value }: any) {
  return (
    <Card>
      <CardActionArea component={Link} href={href} sx={{ p: 1 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Box sx={{ color, mb: 1 }}>{icon}</Box>
          {value === undefined ? (
            <Skeleton variant="text" width={80} sx={{ mx: "auto" }} />
          ) : (
            <Typography variant="h5" fontWeight={700} sx={{ color }}>
              {value.toLocaleString()}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function HomePage() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: statsApi.get,
  });

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #5c35d4 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            ImpactU OpenAlexCO
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
            Explora la producción académica de Colombia
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.75 }}>
            Datos indexados desde OpenAlex · Base de datos:{" "}
            <strong>openalexco</strong>
          </Typography>
        </Container>
      </Box>

      {/* Stats grid */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Grid container spacing={3}>
          {STAT_CARDS.map((card) => (
            <Grid item xs={6} sm={4} md={2} key={card.key}>
              <StatCard
                {...card}
                value={stats ? (stats as any)[card.key] : undefined}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About */}
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          ¿Qué es ImpactU OpenAlexCO?
        </Typography>
        <Typography color="text.secondary">
          ImpactU OpenAlexCO es una interfaz web para explorar los datos de producción
          académica de Colombia almacenados en la base de datos <strong>openalexco</strong>. 
          Puedes buscar y filtrar trabajos científicos, autores, instituciones, revistas, 
          tópicos y conceptos de forma similar a como lo hace{" "}
          <a href="https://openalex.org" target="_blank" rel="noreferrer">
            openalex.org
          </a>.
        </Typography>
      </Container>
    </>
  );
}
