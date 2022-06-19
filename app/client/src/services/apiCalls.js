import axios from "axios";
import jwt_decode from "jwt-decode";

//const BASE_URL = "http://localhost:5500/api/";

const BASE_URL = "https://pin-on-map.herokuapp.com/api/";

const authRequest = axios.create({
  baseURL: BASE_URL,
});

//Axios Interceptors
authRequest.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user.accessToken;
    const decodedToken = jwt_decode(accessToken);
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const refToken = user.refreshToken;
      try {
        const res = await axios.post(`${BASE_URL}auth/refresh`, {
          token: refToken,
        });
        const { accessToken, refreshToken } = res.data;
        const newUser = {
          ...user,
          accessToken,
          refreshToken,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        config.headers["token"] = "Bearer " + accessToken;
      } catch (err) {
        console.log(err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async ({ name, email, password }) => {
  const data = {
    name,
    email,
    password,
  };
  const response = await axios.post(`${BASE_URL}auth/register`, data);
  return response.data;
};

export const login = async ({ email, password }) => {
  const data = {
    email,
    password,
  };
  const response = await axios.post(`${BASE_URL}auth/login`, data);
  return response.data;
};

//Pins
export const pins = async () => {
  try {
    const response = await axios.get(`${BASE_URL}pin/all`);
    const getData = await Promise.all(
      response.data.map(async (item) => {
        try {
          const data = await weatherInfo(item.lat, item.long);
          return {
            ...item,
            temp: data?.current?.temp_c,
            location: data?.location?.name,
            weather: data?.current?.condition?.text,
            time: data?.location?.localtime,
          };
        } catch (err) {
          return {
            ...item,
            temp: 0,
            location: "",
            weather: "",
            time: "",
          };
        }
      })
    );
    return getData;
  } catch (err) {}
};

//Get Weather Info
export const weatherInfo = async (lat, lng) => {
  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=9da24fc7125c4a88b9195707221806&q=${lat},${lng}&aqi=no`
  );
  return response.data;
};

export const addPin = async ({ data }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const response = await authRequest.post(`pin/add`, data, {
    headers: { token: "Bearer " + user?.accessToken },
  });
  return response.data;
};
