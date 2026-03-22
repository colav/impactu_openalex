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
import StorageIcon from "@mui/icons-material/Storage";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { alpha, styled } from "@mui/material/styles";
import Link from "next/link";
import { useDb } from "@/context/DbContext";

const SEARCH_ENTITIES = [
  { value: "works", label: "Works" },
  { value: "authors", label: "Authors" },
  { value: "institutions", label: "Institutions" },
  { value: "sources", label: "Sources" },
  { value: "topics", label: "Topics" },
  { value: "concepts", label: "Concepts" },
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: theme.spacing(2),
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1, 0, 1.5),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    width: "18ch",
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
  const { currentDb, defaultDb, databases, setCurrentDb } = useDb();
  const [q, setQ] = useState("");
  const [entity, setEntity] = useState("works");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dbAnchor, setDbAnchor] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/${entity}?q=${encodeURIComponent(q.trim())}`);
  };

  const activeDb = databases.find((d) => d.key === (currentDb || defaultDb));

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

          {/* Database selector */}
          {databases.length > 0 && (
            <>
              <Chip
                icon={<StorageIcon />}
                label={activeDb?.name ?? "DB"}
                size="small"
                onClick={(e) => setDbAnchor(e.currentTarget)}
                sx={{
                  mr: 1,
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  cursor: "pointer",
                }}
              />
              <Menu
                anchorEl={dbAnchor}
                open={Boolean(dbAnchor)}
                onClose={() => setDbAnchor(null)}
              >
                {databases.map((d) => (
                  <MenuItem
                    key={d.key}
                    selected={d.key === (currentDb || defaultDb)}
                    onClick={() => {
                      setCurrentDb(d.key);
                      setDbAnchor(null);
                    }}
                  >
                    <StorageIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                    {d.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          {/* Search bar with entity selector */}
          <Box component="form" onSubmit={handleSearch}>
            <Search>
              <Select
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                variant="standard"
                disableUnderline
                size="small"
                sx={{
                  color: "white",
                  pl: 1,
                  fontSize: "0.8rem",
                  "& .MuiSelect-icon": { color: "white" },
                  "& .MuiSelect-select": { py: 0.5 },
                  minWidth: 90,
                }}
              >
                {SEARCH_ENTITIES.map((e) => (
                  <MenuItem key={e.value} value={e.value} sx={{ fontSize: "0.85rem" }}>
                    {e.label}
                  </MenuItem>
                ))}
              </Select>
              <Box sx={{ width: "1px", bgcolor: "rgba(255,255,255,0.3)", alignSelf: "stretch", my: 0.5 }} />
              <SearchIconWrapper>
                <SearchIcon fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={`Buscar ${SEARCH_ENTITIES.find((e) => e.value === entity)?.label.toLowerCase()}…`}
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
  const { currentDb, defaultDb, databases, setCurrentDb } = useDb();
  const [q, setQ] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dbAnchor, setDbAnchor] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/works?q=${encodeURIComponent(q.trim())}`);
  };

  const activeDb = databases.find((d) => d.key === (currentDb || defaultDb));

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

          {/* Database selector */}
          {databases.length > 0 && (
            <>
              <Chip
                icon={<StorageIcon />}
                label={activeDb?.name ?? "DB"}
                size="small"
                onClick={(e) => setDbAnchor(e.currentTarget)}
                sx={{
                  mr: 1,
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  cursor: "pointer",
                }}
              />
              <Menu
                anchorEl={dbAnchor}
                open={Boolean(dbAnchor)}
                onClose={() => setDbAnchor(null)}
              >
                {databases.map((d) => (
                  <MenuItem
                    key={d.key}
                    selected={d.key === (currentDb || defaultDb)}
                    onClick={() => {
                      setCurrentDb(d.key);
                      setDbAnchor(null);
                    }}
                  >
                    <StorageIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                    {d.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

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
