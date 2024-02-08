"use client";

import { CarCard } from "@/components/cards";
import { NewCar } from "@/components/modais";
import { useControlPageTitle } from "@/contexts/PageContext";
import { usePrivateApi } from "@/hooks/apiPrivateHooks";
import { useAppSelector } from "@/hooks/reduxHook";
import { AuthReducerStateTypes, ReturnCar } from "@/types";
import { Add, Refresh } from "@mui/icons-material";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useLayoutEffect, useState } from "react";

export default function AllCars() {
  const { user } = useAppSelector(
    (state: { authUser: AuthReducerStateTypes }) => state.authUser
  );
  const { setPageTitle } = useControlPageTitle();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openNewCar, setOpenNewCar] = useState(false);
  const { getAllCars } = usePrivateApi();

  async function getCars() {
    setLoading(true);
    try {
      const { data } = await getAllCars();
      setCars(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    setPageTitle("Carros");
    getCars();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    if (!openNewCar) {
      getCars();
    }
  }, [openNewCar]);

  return (
    <>
      <Grid
        container
        spacing={1}
        padding={2}
        direction="row"
        justifyContent="end"
        alignItems="center"
      >
        {user?.role === "ADMIN" && (
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setOpenNewCar(true)}
              endIcon={<Add />}
            >
              Novo carro
            </Button>
          </Grid>
        )}
        <Grid item>
          <Button variant="contained" onClick={getCars} endIcon={<Refresh />}>
            Recarregar
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {loading ? (
          <CircularProgress />
        ) : cars.length > 0 ? (
          cars.map((car: ReturnCar) => (
            <Grid item key={car.id}>
              <CarCard car={car} />
            </Grid>
          ))
        ) : (
          <p>Nenhum carro cadastrado</p>
        )}
      </Grid>

      <NewCar open={openNewCar} setOpen={setOpenNewCar} />
    </>
  );
}
