/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpMethod, QueryParams, UrlParams } from "@/types";
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosProgressEvent,
  ResponseType,
} from "axios";

export const responseInterceptor = (res: AxiosResponse) => {
  return res;
};

const API = axios.create({
  baseURL: "https://api.github.com",
  withCredentials: false,
});

API.interceptors.response.use(responseInterceptor);

export const callApi = (
  endpoint: string,
  method: HttpMethod,
  payload?: any,
  urlParams?: UrlParams | null,
  queryParams?: QueryParams | null,
  headers?: any,
  responseType?: ResponseType | null,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse<any>> => {
  let url = endpoint;

  if (urlParams) {
    Object.keys(urlParams).forEach((param) => {
      const placeholder = `:${param}`;
      if (url.includes(placeholder)) {
        url = url.replace(placeholder, urlParams[param]);
      }
    });
  }
  url = url.replace(/\/:\w+/g, "");

  const defaultHeaders = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  };

  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    params: queryParams,
    headers: { ...defaultHeaders, ...headers },
    onUploadProgress,
  };

  if (payload !== null && payload !== undefined) {
    requestConfig.data = payload;
  }

  if (responseType) {
    requestConfig.responseType = responseType;
  }

  return API(requestConfig);
};
