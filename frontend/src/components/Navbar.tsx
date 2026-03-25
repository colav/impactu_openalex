"use client";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import StorageIcon from "@mui/icons-material/Storage";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import { useDb } from "@/context/DbContext";

const NAV_LINKS = [
  { label: "Works", href: "/works" },
  { label: "Authors", href: "/authors" },
  { label: "Institutions", href: "/institutions" },
  { label: "Sources", href: "/sources" },
  { label: "Topics", href: "/topics" },
  { label: "Concepts", href: "/concepts" },
];

export default function Navbar() {
  const { currentDb, defaultDb, databases, setCurrentDb } = useDb();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dbAnchor, setDbAnchor] = useState<null | HTMLElement>(null);

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
