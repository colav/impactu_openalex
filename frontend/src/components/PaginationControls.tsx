"use client";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

interface Props {
  count: number;
  page: number;
  perPage: number;
  onChange: (page: number) => void;
}

export default function PaginationControls({ count, page, perPage, onChange }: Props) {
  const pageCount = Math.ceil(count / perPage);
  if (pageCount <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, p) => onChange(p)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
