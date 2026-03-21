"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import Link from "next/link";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: theme.spacing(2),
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "20ch",
  },
}));

const NAV_LINKS = [
  { label: "Works", href: "/works" },
  { label: "Authors", href: "/authors" },
  { label: "Institutions", href: "/institutions" },
  { label: "Sources", href: "/sources" },
  { label: "Topics", href: "/topics" },
  { label: "Concepts", href: "/concepts" },
];

export default function Navbar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/works?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 1, display: { sm: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: 700, mr: 3 }}
          >
            ImpactU
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 0.5 }}>
            {NAV_LINKS.map((l) => (
              <Button key={l.href} color="inherit" component={Link} href={l.href} size="small">
                {l.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box component="form" onSubmit={handleSearch}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar works…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </Search>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 220 }}>
          {NAV_LINKS.map((l) => (
            <ListItemButton
              key={l.href}
              component={Link}
              href={l.href}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
