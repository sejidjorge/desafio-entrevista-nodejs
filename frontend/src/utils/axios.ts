import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  
  const onRequest = (
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig => {
    return config;
  };
  
  const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  };
  
  const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
  };
  
  const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  };
  
  export function setupInterceptorsTo(
    axiosInstance: AxiosInstance
  ): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
  }
  
  export const AxiosPublicService: AxiosInstance = axios.create({
    baseURL: "http://localhost:3001",
  });
  
  export function AxiosPrivateService(accessToken: string | null): AxiosInstance {
    const AxiosPrivateInstance: AxiosInstance = setupInterceptorsTo(
      axios.create({
        baseURL: "http://localhost:3001",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
    return AxiosPrivateInstance;
  }