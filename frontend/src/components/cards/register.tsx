import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface registerData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface RegisterCardTypes {
  register: registerData;
  setRegister: Dispatch<SetStateAction<registerData>>;
  setStep: Dispatch<SetStateAction<number>>;
  showPassword: boolean;
  handleClickShowPassword: () => void;
  handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmitRegister(): Promise<void>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;

}

export default function RegisterCard({
  register,
  setRegister,
  setStep,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleSubmitRegister,
  error,
  setError
}: RegisterCardTypes) {

  function validate() {
    const required = ["name", "email", "password", "confirmPassword"];
    for (const field of required) {
      // @ts-ignore
      if (!register[field]) {
        setError(`${field} é obrigatorio`);
      } else if (register.password !== register.confirmPassword) {
        setError("Senhas não correspondem");
      } else {
        setError("");
      }
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    validate();
  }, [register]);

  return (
    <Card variant="outlined">
      <Typography variant="h3" align="center">
        Register
      </Typography>
      <Typography variant="body1" align="center">
        Crie sua nova conta
      </Typography>
      <Grid container spacing={2} padding={4} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            id="name"
            label="Nome"
            value={register.name}
            onChange={(e) => setRegister({ ...register, name: e.target.value })}
            variant="outlined"
            type="text"
            autoComplete="name"
            size="small"
            fullWidth={true}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="email"
            label="E-mail"
            value={register.email}
            onChange={(e) =>
              setRegister({ ...register, email: e.target.value })
            }
            variant="outlined"
            type="email"
            autoComplete="email"
            size="small"
            fullWidth={true}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Nivel do usuario</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={register.role}
              label="Nivel do usuario"
              onChange={(e) =>
                setRegister({ ...register, role: e.target.value })
              }
            >
              {["ADMIN", "USER"].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth={true} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Senha
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={register.password}
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
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
              label="Senha"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl size="small" fullWidth={true} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Confirmar senha
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={register.confirmPassword}
              onChange={(e) =>
                setRegister({
                  ...register,
                  confirmPassword: e.target.value,
                })
              }
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
              label="Confirmar senha"
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
            type="button"
            onClick={handleSubmitRegister}
          >
            Criar nova conta
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Já possui uma conta?
            <Button variant="text" color="primary" onClick={() => setStep(0)}>
              Login
            </Button>
          </Typography>{" "}
        </Grid>
      </Grid>
    </Card>
  );
}
