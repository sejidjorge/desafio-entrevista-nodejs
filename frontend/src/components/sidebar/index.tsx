import { useControlPageTitle } from "@/contexts/PageContext";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { logout } from "@/store/reducers/authReducer";
import { AuthReducerStateTypes } from '@/types';
import {
  Dashboard,
  DirectionsCar,
  ExitToApp,
  Group,
  Inbox,
  Mail,
  Menu,
  Person2,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
  Grid,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuTypes {
  path: string;
  label: string;
  icon: JSX.Element;
}
interface MenuExpandTypes {
  path: string;
  label: string;
  icon: JSX.Element;
  child?: MenuTypes[];
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state: { authUser: AuthReducerStateTypes }) => state.authUser);
  const { pageTitle } = useControlPageTitle();
  const [open, setOpen] = useState(false);
  const [routes, setRoutes] = useState<MenuExpandTypes[]>([]);
  const dispath = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  function renderRoutes() {
      setRoutes([
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <Dashboard />,
        },
        {
          path: "/cars",
          label: "Carros",
          icon: <DirectionsCar />,
        },
      ]);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    renderRoutes();
  }, []);

  function changeRoute(route: string) {
    router.push(route);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="h5">{pageTitle}</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={toggleDrawer(true)}
                >
                  <Menu />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <SwipeableDrawer
        anchor={"right"}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {routes.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => changeRoute(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  dispath(logout());
                  router.push("/login");
                }}
              >
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
      <Container maxWidth="xl">{children}</Container>
    </>
  );
}
