"use client";
import Chip from "@mui/material/Chip";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

export default function OaBadge({ isOa, status }: { isOa: boolean; status?: string }) {
  if (isOa) {
    return (
      <Chip
        icon={<LockOpenIcon fontSize="small" />}
        label={status ? `OA · ${status}` : "Open Access"}
        size="small"
        color="success"
        variant="outlined"
      />
    );
  }
  return (
    <Chip
      icon={<LockIcon fontSize="small" />}
      label="Closed"
      size="small"
      color="default"
      variant="outlined"
    />
  );
}
