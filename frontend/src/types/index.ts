export interface NewBid {
  bidValue: number;
  carId: string;
}

export interface ReturnBid {
  id: string;
  bidValue: number;
  carId: string;
  userId: string;
  createdAt: Date;
  car: {
    brand: string;
    model: string;
    year: string;
    description: string;
    startBid: number;
    status: string;
  };
}

export interface NewCarTypes {
  brand: string;
  model: string;
  year: string;
  auctionStart: Date;
  auctionEnd: Date;
  startBid: number;
  image: string;
  description: string;
}

interface BidProps {
  id: string;
  bidValue: number;
  createdAt: Date;
}

export interface ReturnCar {
  id: string;
  brand: string;
  model: string;
  year: string;
  description: string;
  image: string;
  auctionStart: Date;
  auctionEnd: Date;
  startBid: number;
  createdAt: Date;
  updatedAt: Date;
  Bids: BidProps[];
}

export interface ReportData {
  total_users: number;
  total_cars: number;
  total_bids: number;
  total_purchases: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataLogin {
  token: string;
  user: User;
}

export interface RegisterUserTypes {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginTypes {
  email: string;
  password: string;
}

export interface updateUser {
  name: string;
  role: string;
}
