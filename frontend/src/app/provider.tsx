"use client";

import Sidebar from "@/components/sidebar";
import Middleware from "@/middlewares";
import { store } from "@/store";
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import Container from "@mui/material/Container";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <Middleware>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Container>
          {pathname === "/login" ? (
            <>{children}</>
          ) : (
            <Sidebar>{children}</Sidebar>
          )}
        </Container>
        </ThemeProvider>
      </Middleware>
    </Provider>
  );
}
