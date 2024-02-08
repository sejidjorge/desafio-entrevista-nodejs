"use client";

import Sidebar from "@/components/sidebar";
import ControlPageTitleProvider from '@/contexts/PageContext';
import Middleware from "@/middlewares";
import { store } from "@/store";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import Container from "@mui/material/Container";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <Middleware>
        <ThemeProvider theme={darkTheme}>
          <ControlPageTitleProvider>
            <CssBaseline />
            {pathname === "/login" ? (
              <>{children}</>
            ) : (
              <Sidebar>{children}</Sidebar>
            )}
          </ControlPageTitleProvider>
        </ThemeProvider>
      </Middleware>
    </Provider>
  );
}
