import { usePrivateApi } from "@/hooks/apiPrivateHooks";
import { useAppSelector } from "@/hooks/reduxHook";
import { AuthReducerStateTypes, ReturnCar } from "@/types";
import { formatCurrencyBr, formatDate } from "@/utils/formats";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useState,
} from "react";
import EditCar from "./editCar";

interface DetailCarModalProps {
  carId: string;
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

export default function DetailsCar(props: DetailCarModalProps) {
  const { getCarById, newBid } = usePrivateApi();
  const { user } = useAppSelector(
    (state: { authUser: AuthReducerStateTypes }) => state.authUser
  );
  const [loading, setLoading] = useState(false);
  const [openBidModal, setOpenBidModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [bid, setBid] = useState(0);
  const [car, setCar] = useState<ReturnCar>({} as unknown as ReturnCar);
  const majorBid =
    car?.Bids?.length > 0
      ? Math.max(...car.Bids.map((bid) => bid.bidValue))
      : car.startBid;

  const handleClose = () => {
    props.setOpen(false);
  };

  async function getCar() {
    setLoading(true);
    try {
      const { data } = await getCarById(props.carId);
      setCar(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleCloseBidModal = () => {
    setOpenBidModal(false);
    getCar();
  };

  async function handleNewBid() {
    setLoading(true);
    try {
      await newBid({
        bidValue: bid,
        carId: props.carId,
      });
      handleCloseBidModal();
      setBid(0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if ((props.open && props.carId) || !openEditModal) {
      getCar();
    }
  }, [props, openEditModal]);

  return (
    <>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Card sx={{ width: 375 }}>
          <CardMedia
            component="img"
            height="230"
            image={car?.image}
            alt={`${car?.brand}-${car?.model}-${car?.year}`}
          />
          <CardContent>
            <Typography
              align="center"
              gutterBottom
              variant="body1"
              color="text.secondary"
            >
              {`LEILÃO ${formatDate(new Date(car?.auctionEnd))}`}
            </Typography>

            <Typography variant="h4" component="div">
              {`${car?.brand} ${car?.model} ${car?.year}`}
              {user?.role === "ADMIN" && (
                <Tooltip title="Editar veiculo">
                  <IconButton onClick={() => setOpenEditModal(true)}>
                    <Icon>
                      <Edit />
                    </Icon>
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
            <Typography gutterBottom variant="body2" color="text.secondary">
              {`LANCE INICIAL: ${formatCurrencyBr(car?.startBid)}`}
            </Typography>

            <Typography gutterBottom variant="body2" color="text.primary">
              {`LANCE ATUAL: ${formatCurrencyBr(Number(majorBid))}`}
            </Typography>

            <Typography variant="body1" color="text.primary">
              {car?.description}
            </Typography>
          </CardContent>
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => {
                setOpenBidModal(true);
                setBid(majorBid);
              }}
            >
              Ofertar lance
            </Button>
          </CardActions>
        </Card>
      </Dialog>
      <Dialog
        open={openBidModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseBidModal}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Ofertar lance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insira o valor do lance que deseja ofertar
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Valor do lance"
            type="number"
            fullWidth
            value={bid}
            onChange={(e) => setBid(Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            }}
            error={majorBid >= bid}
            helperText="O valor do seu lance deve ser maior o lance atual"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBidModal} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleNewBid} disabled={loading}>
            Ofertar
          </Button>
        </DialogActions>
      </Dialog>
      <>
        <EditCar
          open={openEditModal}
          setOpen={setOpenEditModal}
          carId={car.id}
        />
      </>
    </>
  );
}
