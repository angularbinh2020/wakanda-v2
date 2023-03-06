import PopupService from "src/utils/PopupService";
import axios from "axios";
import { goBack, showNotificationPopup } from "src/utils";
import { API_URLS } from "src/const/api-urls";
import { SESSION_STORAGE_KEYS } from "src/const/session-storage-keys";

const DEFAULT_BASE_URL = config?.baseUrl;

const DEFAULT_TIMEOUT = 90000;

const getHeaders: any = () => {
  const accessToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
  if (accessToken)
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${sessionStorage.getItem(
        SESSION_STORAGE_KEYS.ACCESS_TOKEN
      )}`,
    };
  return null;
};

const doExpired = () => {
  showNotificationPopup({
    content: "session_expired_message",
    onOk: () => {
      PopupService.instance.current.close();
      goBack();
    },
    showIcon: false,
  });
};

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log("Error interceptor", error?.code, error.toString());
    const config = error?.config;
    const isNoInternet = error?.toString()?.startsWith("Error: Network Error");
    const status = error?.response?.status;
    const isTimeoutOrServerError =
      error?.code == "ECONNABORTED" || status >= 500;
    const isAuthenticationError =
      status == 401 ||
      status == 403 ||
      (status == 400 && config?.url == API_URLS.LOGIN);
    if (isNoInternet) {
      showNotificationPopup({
        content: "no_internet",
        onOk: () => {
          PopupService.instance.current.close();
          goBack();
        },
        showIcon: false,
      });
    } else if (isTimeoutOrServerError) {
      showNotificationPopup({
        content: "general_error",
        onOk: () => {
          PopupService.instance.current.close();
          goBack();
        },
      });
    } else if (isAuthenticationError) {
      doExpired();
    }
    return Promise.reject(error);
  }
);
export interface RequestParams {
  url: string;
  baseURL?: string;
  params?: any;
  headers?: any;
  queryParams?: any;
}

export const get = (requestParams: RequestParams) => {
  console.log("Request get", requestParams);
  const headers = requestParams.headers || getHeaders();
  if (headers)
    return axios.get(requestParams.url, {
      params: requestParams.params,
      baseURL: requestParams.baseURL || DEFAULT_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      headers,
    });
  doExpired();
  return Promise.reject(null);
};

export const post = (requestParams: RequestParams) => {
  console.log("Request post", requestParams);
  const headers = requestParams.headers || getHeaders();
  if (headers)
    return axios.post(requestParams.url, requestParams.params, {
      params: requestParams.queryParams,
      baseURL: requestParams.baseURL || DEFAULT_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      headers,
    });
  doExpired();
  return Promise.reject(null);
};
