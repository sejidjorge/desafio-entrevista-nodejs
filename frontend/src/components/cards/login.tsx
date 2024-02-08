import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface loginData {
  email: string;
  password: string;
}

interface LoginCardTypes {
  login: loginData;
  setLogin: (login: loginData) => Dispatch<SetStateAction<loginData>>;
  setStep: (step: number) => Dispatch<SetStateAction<number>>;
  showPassword: boolean;
  handleClickShowPassword: () => void;
  handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmitLogin(): Promise<void>;
  error: string;
  setError: (error: string) => Dispatch<SetStateAction<string>>;
}

export default function LoginCard({
  login,
  setLogin,
  setStep,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleSubmitLogin,
  error,
  setError,
}: LoginCardTypes) {
  function validate() {
    const required = ["email", "password"];
    for (const field of required) {
      if (!login[field]) {
        setError(`${field} is required`);
      } else {
        setError("");
      }
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    validate();
  }, [login]);

  return (
    <Card variant="outlined">
      <Typography variant="h3" align="center">
        Login
      </Typography>
      <Typography variant="body1" align="center">
        Login to your account
      </Typography>
      <Grid container spacing={2} padding={4} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            id="email"
            label="E-mail"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            variant="outlined"
            type="email"
            autoComplete="email"
            size="small"
            fullWidth={true}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth={true} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Grid>
        {error !== "" && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={error !== "" ? true : false}
            onClick={handleSubmitLogin}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            New user?
            <Button variant="text" color="primary" onClick={() => setStep(1)}>
              Create new Account
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}
