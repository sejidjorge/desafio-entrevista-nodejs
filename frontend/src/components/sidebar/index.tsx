import { useAppSelector } from "@/hooks/reduxHook";
import {
  Dashboard,
  DirectionsCar,
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
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
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
  const { user } = useAppSelector((state: { authUser: any }) => state.authUser);
  const [open, setOpen] = useState(false);
  const [routes, setRoutes] = useState<MenuExpandTypes[]>([]);
  const router = useRouter();

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
    if (user.role === "ADMIN") {
      setRoutes([
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <Dashboard />,
        },
        {
          path: "/users",
          label: "Users",
          icon: <Group />,
        },
        {
          path: "/cars",
          label: "Cars",
          icon: <DirectionsCar />,
        },
        {
          path: "/profile",
          label: "Profile",
          icon: <Person2 />,
        },
      ]);
    } else {
      setRoutes([
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <Dashboard />,
        },
        {
          path: "/cars",
          label: "Cars",
          icon: <DirectionsCar />,
        },
        {
          path: "/profile",
          label: "Profile",
          icon: <Person2 />,
        },
      ]);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    renderRoutes();
  }, []);

  function changeRoute(route: string) {
    router.push(route);
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
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
          </List>
        </Box>
      </SwipeableDrawer>
      {children}
    </div>
  );
}
