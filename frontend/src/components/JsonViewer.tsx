"use client";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

export default function JsonViewer({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" color="text.secondary">
          JSON completo
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ position: "relative" }}>
          <Tooltip title={copied ? "¡Copiado!" : "Copiar JSON"}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
            >
              {copied ? (
                <CheckIcon fontSize="small" color="success" />
              ) : (
                <ContentCopyIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              fontSize: 12,
              lineHeight: 1.6,
              overflowX: "auto",
              maxHeight: 500,
              overflowY: "auto",
              bgcolor: "grey.900",
              color: "grey.100",
              borderRadius: 0,
              fontFamily: "monospace",
            }}
          >
            {json}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
