"use client";
import { useAuth } from "@/lib/auth";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SocialOwl Blog
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" href="/categories">
                Categories
              </Button>
              <Button color="inherit" href="/posts">
                Posts
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" href="/auth/login">
                Login
              </Button>
              <Button color="inherit" href="/auth/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
