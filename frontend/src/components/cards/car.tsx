import { formatCurrencyBr, formatDate } from "@/utils/formats";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DetailsCar } from "../modais";

interface CarTypes {
  car: {
    id: string;
    brand: string;
    model: string;
    year: string;
    auctionStart: string;
    auctionEnd: string;
    startBid: number;
    createdAt: string;
    updatedAt: string;
    image: string;
    description: string;
    Bids: {
      id: string;
      bidValue: number;
      createdAt: string;
    }[];
  };
}

export default function CarCard({ car }: CarTypes) {
  const [openDetailsCar, setOpenDetailsCar] = useState(false);
  const [carId, setCarId] = useState("");
  const majorBid =
    car?.Bids?.length > 0
      ? Math.max(...car.Bids.map((bid) => bid.bidValue))
      : car.startBid;

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          height="134"
          image={car.image}
          alt={`${car.brand}-${car.model}-${car.year}`}
        />
        <CardContent>
          <Typography
            align="center"
            gutterBottom
            variant="body1"
            color="text.secondary"
          >
            {`LEILÃO ${formatDate(new Date(car.auctionEnd))}`}
          </Typography>
          <Typography variant="h6" component="div">
            {`${car?.brand} ${car?.model} ${car?.year}`}
          </Typography>
          <Typography
            gutterBottom
            variant="caption"
            color="text.secondary"
            component="div"
          >
            {`LANCE INICIAL: ${formatCurrencyBr(car.startBid)}`}
          </Typography>
          <Typography
            gutterBottom
            variant="caption"
            color="text.primary"
            component="div"
          >
            {`LANCE ATUAL: ${formatCurrencyBr(majorBid)}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {car.description.length > 100
              ? `${car.description.substring(0, 100)}...`
              : car.description}
          </Typography>
          <Divider />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setCarId(car.id);
              setOpenDetailsCar(true);
            }}
          >
            Ofertar lance
          </Button>
        </CardActions>
      </Card>
      <DetailsCar
        open={openDetailsCar}
        setOpen={setOpenDetailsCar}
        carId={carId}
      />
    </>
  );
}
