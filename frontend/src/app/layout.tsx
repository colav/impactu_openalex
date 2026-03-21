import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
  title: "ImpactU OpenAlexCO",
  description: "Explore Colombian academic output via OpenAlex",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          <Box component="main" sx={{ minHeight: "90vh", bgcolor: "background.default", pb: 6 }}>
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
