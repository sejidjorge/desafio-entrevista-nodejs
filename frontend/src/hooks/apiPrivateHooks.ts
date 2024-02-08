import { NewBid, NewCar, updateUser } from "@/types";
import { AxiosPrivateService } from "@/utils/axios";

function getToken(): string | null {
  const localStorageData = localStorage.getItem("persist:root");
  const parsedData = JSON.parse(localStorageData || "");
  const authData = parsedData?.authUser;
  const token = JSON.parse(authData)?.token;
  return token;
}

export const usePrivateApi = () => ({
  getAllUsers: async () => {
    const response = await AxiosPrivateService(getToken()).get("/users/list");
    return response;
  },
  getUserById: async (userId: string) => {
    const response = await AxiosPrivateService(getToken()).get(
      `/users/${userId}`
    );
    return response;
  },
  updateUser: async (userId: string, body: updateUser) => {
    const response = await AxiosPrivateService(getToken()).put(
      `/users/${userId}`,
      body
    );
    return response;
  },
  deleteUser: async (userId: string) => {
    const response = await AxiosPrivateService(getToken()).delete(
      `/users/${userId}`
    );
    return response;
  },
  newCar: async (body: NewCar) => {
    const response = await AxiosPrivateService(getToken()).post(
      "/cars/new",
      body
    );
    return response;
  },
  getAllCars: async () => {
    const response = await AxiosPrivateService(getToken()).get("/cars/new");
    return response;
  },
  getCarById: async (carId: string) => {
    const response = await AxiosPrivateService(getToken()).get(
      `/cars/${carId}`
    );
    return response;
  },
  updateCar: async (carId: string, body: NewCar) => {
    const response = await AxiosPrivateService(getToken()).put(
      `/cars/${carId}`,
      body
    );
    return response;
  },
  deleteCar: async (carId: string) => {
    const response = await AxiosPrivateService(getToken()).delete(
      `/cars/${carId}`
    );
    return response;
  },
  newBid: async (body: NewBid) => {
    const response = await AxiosPrivateService(getToken()).post("/bids", body);
    return response;
  },
  getUserBids: async () => {
    const response = await AxiosPrivateService(getToken()).get("/bids");
    return response;
  },
  getAllUsersBids: async (body: NewBid) => {
    const response = await AxiosPrivateService(getToken()).get("/bids");
    return response;
  },
});
