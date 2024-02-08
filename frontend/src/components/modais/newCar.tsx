import { usePrivateApi } from "@/hooks/apiPrivateHooks";
import { NewCarTypes } from "@/types";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { verify } from "crypto";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";

interface NewCarModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewCar(props: NewCarModalProps) {
  const { newCar } = usePrivateApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [car, setCar] = useState<NewCarTypes>({
    brand: "",
    model: "",
    year: "",
    auctionStart: new Date(),
    auctionEnd: new Date(),
    startBid: 0,
    image: "",
    description: "",
  });

  const handleClose = () => {
    props.setOpen(false);
  };

  async function verify() {
    const required = [
      "brand",
      "model",
      "year",
      "auctionStart",
      "auctionEnd",
      "startBid",
    ];
    for (const field of required) {
      //@ts-ignore
      if (!car[field]) {
        setError(`${field} é obrigatorio`);
        return false;
      }
      setError("");
      return true;
    }
  }

  async function handleNewCar() {
    setLoading(true);
    const isValid = await verify();
    if (!isValid) {
      return;
    }
    try {
      const { data } = await newCar({
        ...car,
        auctionStart: new Date(car.auctionStart),
        auctionEnd: new Date(car.auctionEnd),
      });
      console.log(data);
      setCar({
        brand: "",
        model: "",
        year: "",
        auctionStart: new Date(),
        auctionEnd: new Date(),
        startBid: 0,
        image: "",
        description: "",
      });
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Novo carro"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Forneça todos os dados antes de enviar.
        </DialogContentText>
        <Grid container spacing={1} padding={1} justifyContent="center">
          <Grid item xs={12}>
            <TextField
              id="brand"
              label="Marca"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
              variant="outlined"
              type="text"
              size="small"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="model"
              label="Modelo"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
              variant="outlined"
              type="text"
              size="small"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="year"
              label="Ano"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
              variant="outlined"
              type="text"
              size="small"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="startBid"
              label="Lance inicial"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              value={car.startBid}
              onChange={(e) =>
                setCar({ ...car, startBid: Number(e.target.value) })
              }
              variant="outlined"
              type="number"
              size="small"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="image"
              label="Imagem"
              value={car.image}
              onChange={(e) => setCar({ ...car, image: e.target.value })}
              variant="outlined"
              type="text"
              size="small"
              helperText="Forneça o link da imagem do veiculo, ex: https://picsum.photos/200"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="auctionStart"
              label="Início do leilão"
              value={car.auctionStart}
              //@ts-ignore
              onChange={(e) => setCar({ ...car, auctionStart: e.target.value })}
              variant="outlined"
              type="date"
              size="small"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="auctionEnd"
              label="Fim do leilão"
              value={car.auctionEnd}
              //@ts-ignore
              onChange={(e) => setCar({ ...car, auctionEnd: e.target.value })}
              variant="outlined"
              type="date"
              size="small"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="description"
              label="Descrição"
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
              variant="outlined"
              multiline
              rows={4}
              type="text"
              size="small"
              fullWidth={true}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogContent>
        {error !== "" && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
        {loading && <CircularProgress />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleNewCar} disabled={loading} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
