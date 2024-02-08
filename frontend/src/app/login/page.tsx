"use client";

import { LoginCard, RegisterCard } from "@/components/cards";
import Notification from "@/components/notifications";
import { usePublicApi } from "@/hooks/apiPublicHooks";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHook";
import { Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import sha256 from "sha256";
import { loginAction, logout } from "@/store/reducers/authReducer";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Login() {
  const { loginConection, registerConection } = usePublicApi();
  const token = useAppSelector((state) => state.authUser.token);
  const dispath = useAppDispatch();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [register, setRegister] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setLogin({ email: "", password: "" });
    setRegister({
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    });
  }, [step]);

  async function handleSubmitLogin() {
    try {
      const body = {
        email: login.email,
        password: sha256(login.password),
      };
      const {
        data
      } = await loginConection(body);
      console.log(data);
      
      dispath(loginAction(data));
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    }
  }

  async function handleSubmitRegister() {
    try {
      if (register.password !== register.confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      const body = {
        name: register.name,
        email: register.email,
        role: register.role,
        password: sha256(register.password),
      };
      await registerConection(body);
      setStep(0);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message || "error register");
    }
  }

  if (token !== "") {
    const decoded: {
      id: string;
      name: string;
      role: string;
      exp: number;
      iat: number;
    } = jwtDecode(token);

    if (decoded?.exp > Math.floor(Date.now() / 1000)) {
      router.push("/dashboard");
    } else {
      dispath(logout());
    }
  }

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="wrap"
        sx={{ height: "100vh" }}
      >
        <Grid item xs={12} md={5} lg={4}>
          {step === 0 && (
            <LoginCard
              login={login}
              setLogin={setLogin}
              setStep={setStep}
              showPassword={showPassword}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={handleMouseDownPassword}
              handleSubmitLogin={handleSubmitLogin}
              error={error}
              setError={setError}
            />
          )}
          {step === 1 && (
            <RegisterCard
              register={register}
              setRegister={setRegister}
              setStep={setStep}
              showPassword={showPassword}
              handleSubmitRegister={handleSubmitRegister}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={handleMouseDownPassword}
              error={error}
              setError={setError}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
